import { createHash } from 'node:crypto'

const allowedOrigins = new Set([
  'https://akvegadigital.web.app',
  'https://akvegadigital.firebaseapp.com',
  'https://akvega.com',
  'https://www.akvega.com',
])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const windowMs = 10 * 60 * 1000
const logoUrl = 'https://akvegadigital.web.app/full-logo.svg'

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

function emailLayout({ eyebrow, title, intro, content, footer = 'The Akvega team' }) {
  return `<!doctype html><html><body style="margin:0;background:#f3f7fb;color:#06152e;font-family:Arial,Helvetica,sans-serif;">
  <div style="padding:32px 16px;"><div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #dfe7f0;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(6,21,46,.08);">
  <div style="padding:24px 28px;border-bottom:1px solid #e8eef5;"><img src="${logoUrl}" alt="Akvega" width="150" style="display:block;width:150px;height:auto;" /></div>
  <div style="padding:36px 28px 40px;"><p style="margin:0 0 12px;color:#1478f2;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">${eyebrow}</p>
  <h1 style="margin:0 0 16px;font-size:30px;line-height:1.12;letter-spacing:-.03em;font-weight:700;">${title}</h1>
  <p style="margin:0 0 24px;color:#52647d;font-size:16px;line-height:1.6;">${intro}</p>${content}</div>
  <div style="padding:20px 28px;background:#f7faff;color:#718198;font-size:12px;line-height:1.5;">${footer}<br><a href="https://akvegadigital.web.app" style="color:#1478f2;text-decoration:none;">akvegadigital.web.app</a></div>
  </div></div></body></html>`
}

const inquiryRow = (label, value) => `<tr><td style="padding:11px 0;color:#718198;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;width:110px;">${label}</td><td style="padding:11px 0;color:#06152e;font-size:15px;line-height:1.5;">${value}</td></tr>`

export function inquiryHtml(data) {
  return emailLayout({
    eyebrow: 'New request received',
    title: `A new project inquiry from ${escapeHtml(data.name)}`,
    intro: 'Someone has submitted the contact form. Reply directly to this email to reach them.',
    content: `<table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid #e8eef5;">${inquiryRow('Name', escapeHtml(data.name))}${inquiryRow('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#1478f2;">${escapeHtml(data.email)}</a>`)}${inquiryRow('Company', escapeHtml(data.company || 'Not provided'))}${inquiryRow('Area', escapeHtml(data.interest === 'technology' ? 'Technology' : 'Digital'))}</table><div style="margin-top:24px;padding:18px 20px;background:#f7faff;border-left:3px solid #1478f2;color:#263956;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</div>`,
    footer: 'New inquiry · Akvega contact form',
  })
}

export function acknowledgementHtml(name) {
  return emailLayout({
    eyebrow: 'Message received',
    title: `Thanks for reaching out, ${escapeHtml(name)}.`,
    intro: 'Your inquiry is safely with us. We’ll review it and get back to you at this email address.',
    content: '<div style="padding:18px 20px;background:#eef8ff;border-radius:12px;color:#16456c;font-size:15px;line-height:1.6;">We usually reply with the next useful step, not a generic proposal. If there’s anything you’d like to add, simply reply to this email.</div>',
    footer: 'This is an automatic confirmation from Akvega',
  })
}

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
          subject: `New request received | ${data.company || data.name}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Company: ${data.company || 'Not provided'}`,
            `Area: ${data.interest === 'technology' ? 'Technology' : 'Digital'}`,
            '',
            data.message,
          ].join('\n'),
          html: inquiryHtml(data),
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
          html: acknowledgementHtml(data.name),
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
