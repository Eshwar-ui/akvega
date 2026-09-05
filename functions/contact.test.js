/* eslint-disable no-await-in-loop -- Sequential requests exercise rate limiting and independent response cases. */
import test from 'node:test'
import assert from 'node:assert/strict'
import { createContactHandler } from './contact.js'

const valid = { name: 'Test Visitor', email: 'visitor@example.com', company: '', interest: 'technology', message: 'A project inquiry.' }
const config = { apiKey: 'test-key', from: 'Akvega <contact@example.com>', to: 'inbox@example.com' }

function request(body = valid, overrides = {}) {
  return { method: 'POST', body, ip: '127.0.0.1', get: () => 'https://akvegadigital.web.app', is: () => true, ...overrides }
}

function response() {
  return {
    code: 200, headers: {}, body: null,
    set(key, value) { this.headers[key] = value; return this },
    status(code) { this.code = code; return this },
    json(body) { this.body = body; return this },
  }
}

test('sends to the configured inbox, with visitor reply-to and plain-text content', async () => {
  let sent
  const handler = createContactHandler({ getConfig: () => config, fetchEmail: async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails/batch')
    assert.equal(options.headers.Authorization, 'Bearer test-key')
    sent = JSON.parse(options.body)
    return { ok: true, json: async () => ({ data: [{ id: 'inquiry-id' }, { id: 'reply-id' }] }) }
  } })
  const res = response()
  await handler(request({ ...valid, to: 'attacker@example.com', message: '<script>text</script>' }), res)
  assert.equal(res.code, 200)
  assert.deepEqual(res.body, { ok: true })
  assert.equal(sent.length, 2)
  assert.deepEqual(sent[0].to, [config.to])
  assert.equal(sent[0].from, config.from)
  assert.equal(sent[0].reply_to, valid.email)
  assert.match(sent[0].text, /<script>text<\/script>/)
  assert.equal(typeof sent[0].html, 'string')
  assert.match(sent[0].html, /New request received/)
  assert.match(sent[0].html, /&lt;script&gt;text&lt;\/script&gt;/)
  assert.deepEqual(sent[1].to, [valid.email])
  assert.equal(sent[1].from, config.from)
  assert.equal(sent[1].reply_to, config.to)
  assert.match(sent[1].subject, /received your message/)
  assert.doesNotMatch(sent[1].text, /<script>/)
  assert.match(sent[1].html, /Message received/)
  assert.match(sent[1].html, /https:\/\/akvegadigital\.web\.app\/full-logo\.svg/)
})

test('rejects malformed input, oversized requests, wrong methods and foreign origins without sending', async () => {
  const handler = createContactHandler({ getConfig: () => config, fetchEmail: async () => assert.fail('Must not send') })
  const cases = [
    [request(null), 400],
    [request({ ...valid, name: '' }), 400],
    [request({ ...valid, email: 'invalid' }), 400],
    [request({ ...valid, name: 'Header\r\nInjection' }), 400],
    [request({ ...valid, interest: 'unknown' }), 400],
    [request({ ...valid, message: 'a'.repeat(5001) }), 400],
    [request(valid, { method: 'GET' }), 405],
    [request(valid, { is: () => false }), 415],
    [request(valid, { rawBody: { length: 16385 } }), 413],
    [request(valid, { get: () => 'https://other.example.com' }), 403],
  ]
  for (const [req, code] of cases) {
    const res = response()
    await handler(req, res)
    assert.equal(res.code, code)
    assert.notEqual(res.body.ok, true)
  }
})

test('honeypot submissions do not send email', async () => {
  const handler = createContactHandler({ getConfig: () => config, fetchEmail: async () => assert.fail('Must not send') })
  const res = response()
  await handler(request({ ...valid, website: 'spam' }), res)
  assert.deepEqual(res.body, { ok: true })
})

test('upstream errors, invalid success payloads and network failures never report success', async () => {
  for (const fetchEmail of [
    async () => ({ ok: false, status: 403, json: async () => ({ message: 'private provider details' }) }),
    async () => ({ ok: true, status: 200, json: async () => ({}) }),
    async () => { throw new Error('network') },
  ]) {
    const handler = createContactHandler({ getConfig: () => config, fetchEmail })
    const res = response()
    await handler(request(), res)
    assert.equal(res.code, 502)
    assert.notEqual(res.body.ok, true)
    assert.doesNotMatch(JSON.stringify(res.body), /private provider details|test-key/)
  }
})

test('limits bursts and allows attempts again after the window expires', async () => {
  let time = 1000
  let sends = 0
  const handler = createContactHandler({ getConfig: () => config, now: () => time, fetchEmail: async () => {
    sends += 1
    return { ok: true, json: async () => ({ data: [{ id: 'inquiry-id' }, { id: 'reply-id' }] }) }
  } })
  for (let i = 0; i < 5; i += 1) await handler(request(), response())
  const limited = response()
  await handler(request(), limited)
  assert.equal(limited.code, 429)
  assert.equal(sends, 5)
  time += 600001
  const retry = response()
  await handler(request(), retry)
  assert.equal(retry.code, 200)
  assert.equal(sends, 6)
})

test('missing server configuration reports unavailability without sending', async () => {
  const handler = createContactHandler({ getConfig: () => ({}), fetchEmail: async () => assert.fail('Must not send') })
  const res = response()
  await handler(request(), res)
  assert.equal(res.code, 503)
})
