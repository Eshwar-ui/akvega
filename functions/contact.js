import { createHash } from 'node:crypto'

const allowedOrigins = new Set([
  'https://akvegadigital.web.app',
  'https://akvegadigital.firebaseapp.com',
  'https://akvega.com',
  'https://www.akvega.com',
])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const windowMs = 10 * 60 * 1000

export function createContactHandler({ getConfig, fetchEmail = fetch, now = Date.now, allowLocalOrigins = false }) {
  // Best-effort burst protection per instance, reset on cold starts.
  const attempts = new Map()

  return async (req, res) => {
    res.set('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
      res.set('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed.' })
    }
    const origin = req.get('origin')
    const local = (allowLocalOrigins || process.env.FUNCTIONS_EMULATOR === 'true') &&
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '')
    if (origin && !allowedOrigins.has(origin) && !local) {
      return res.status(403).json({ error: 'Origin not allowed.' })
    }
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Send JSON data.' })
    }
    if (req.rawBody?.length > 16384) {
      return res.status(413).json({ error: 'Message is too long.' })
    }
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Check your form details.' })
    }
    if (body.website) return res.status(200).json({ ok: true })

    const limits = { name: 120, email: 254, company: 200, interest: 20, message: 5000 }
    const data = {}
    for (const [field, limit] of Object.entries(limits)) {
      const value = body[field] ?? (field === 'company' ? '' : null)
      if (typeof value !== 'string' || value.length > limit ||
          (field !== 'company' && !value.trim()) ||
          (field !== 'message' && (/[\r\n]/.test(value) || value.includes('\0')))) {
        return res.status(400).json({ error: 'Check your form details and field lengths.' })
      }
      data[field] = value.trim()
    }
    if (!emailPattern.test(data.email) || !['technology', 'digital'].includes(data.interest)) {
      return res.status(400).json({ error: 'Enter a valid email and select an area of interest.' })
    }

    const time = now()
    for (const [key, entry] of attempts) {
      if (entry.expires <= time) attempts.delete(key)
    }
    const ip = req.ip || 'unknown'
    const entry = attempts.get(ip) || { count: 0, expires: time + windowMs }
    if (entry.count >= 5 || attempts.size >= 10000) {
      res.set('Retry-After', '600')
      return res.status(429).json({ error: 'Too many attempts. Please try again in 10 minutes.' })
    }
    entry.count += 1
    attempts.set(ip, entry)

    try {
      const { apiKey, from, to } = getConfig()
      const senderAddress = from?.match(/<([^<>]+)>$/)?.[1] || from
      if (!apiKey || !emailPattern.test(senderAddress || '') || !emailPattern.test(to || '') ||
          /[\r\n]/.test(from + to)) {
        return res.status(503).json({ error: 'Email is temporarily unavailable. Please try again later.' })
      }
      const emails = [{
          from,
          to: [to],
          reply_to: data.email,
          subject: `New project inquiry - ${data.company || data.name}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Company: ${data.company || 'Not provided'}`,
            `Area: ${data.interest === 'technology' ? 'Technology' : 'Digital'}`,
            '',
            data.message,
          ].join('\n'),
        }, {
          from,
          to: [data.email],
          reply_to: to,
          subject: 'We received your message | Akvega',
          // Fixed copy avoids reflecting visitor-controlled links into an auto-reply.
          text: [
            'Thanks for getting in touch with Akvega.',
            '',
            'Your inquiry has been received. Our team will review it and reply to this email address.',
            'If you have anything to add, simply reply to this email.',
            '',
            'The Akvega team',
          ].join('\n'),
        }]
      const payload = JSON.stringify(emails)
      // Identical retries are deduplicated by Resend for 24 hours.
      const idempotencyKey = `contact-${createHash('sha256').update(payload).digest('hex')}`
      const response = await fetchEmail('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        signal: AbortSignal.timeout(15000),
        body: payload,
      })
      const result = await response.json()
      if (!response.ok || !Array.isArray(result.data) || result.data.length !== 2 ||
          !result.data.every((email) => typeof email.id === 'string' && email.id.length > 0)) {
        console.error('Contact email rejected', { status: response.status })
        return res.status(502).json({ error: 'Your message could not be sent. Please try again later.' })
      }
      return res.status(200).json({ ok: true })
    } catch {
      console.error('Contact email request failed')
      return res.status(502).json({ error: 'Your message could not be sent. Please try again later.' })
    }
  }
}
