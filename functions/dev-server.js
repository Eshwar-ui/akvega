import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'
import { createContactHandler } from './contact.js'
import { getContactConfig } from './config.js'

export function createContactServer(options = {}) {
  const handle = createContactHandler({ getConfig: getContactConfig, allowLocalOrigins: true, ...options })
  return createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    if (req.url?.split('?')[0] !== '/api/contact') {
      res.writeHead(404).end(JSON.stringify({ error: 'Not found.' }))
      return
    }
    const chunks = []
    let length = 0
    try {
      for await (const chunk of req) {
        length += chunk.length
        if (length > 16384) {
          res.writeHead(413).end(JSON.stringify({ error: 'Message is too long.' }))
          return
        }
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks)
      let body
      try {
        body = rawBody.length ? JSON.parse(rawBody.toString('utf8')) : null
      } catch {
        res.writeHead(400).end(JSON.stringify({ error: 'Invalid JSON.' }))
        return
      }
      await handle({
        method: req.method,
        body,
        rawBody,
        ip: req.socket.remoteAddress,
        get: (name) => req.headers[name.toLowerCase()],
        is: (type) => req.headers['content-type']?.split(';')[0].trim() === type,
      }, {
        set(name, value) { res.setHeader(name, value); return this },
        status(code) { res.statusCode = code; return this },
        json(value) { res.end(JSON.stringify(value)); return this },
      })
    } catch {
      if (!res.writableEnded) res.writeHead(500).end(JSON.stringify({ error: 'Request failed.' }))
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = getContactConfig()
  if (!config.apiKey || !config.from || !config.to) {
    console.warn('Contact email needs RESEND_API_KEY, CONTACT_FROM and CONTACT_TO in functions/.env.')
  }
  createContactServer().listen(5001, '127.0.0.1', () => {
    process.stdout.write('Contact API listening at http://127.0.0.1:5001/api/contact\n')
  })
}
