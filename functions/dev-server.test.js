import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createContactServer } from './dev-server.js'

test('HTTP contact flow returns success after both emails are accepted', async (t) => {
  const batches = []
  const server = createContactServer({
    getConfig: () => ({ apiKey: 'test-key', from: 'contact@example.com', to: 'team@example.com' }),
    fetchEmail: async (_url, options) => {
      batches.push({ emails: JSON.parse(options.body), key: options.headers['Idempotency-Key'] })
      return { ok: true, json: async () => ({ data: [{ id: 'inquiry' }, { id: 'confirmation' }] }) }
    },
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve) }))
  const url = `http://127.0.0.1:${server.address().port}/api/contact`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: JSON.stringify({ name: 'Visitor', email: 'visitor@example.com', interest: 'digital', message: 'A new website.' }),
  }
  const result = await fetch(url, options)
  assert.equal(result.status, 200)
  assert.deepEqual(await result.json(), { ok: true })
  assert.deepEqual(batches[0].emails.map((email) => email.to), [['team@example.com'], ['visitor@example.com']])

  const retry = await fetch(url, options)
  assert.equal(retry.status, 200)
  assert.equal(batches[0].key, batches[1].key)
  const changed = await fetch(url, { ...options, body: options.body.replace('new website', 'mobile app') })
  assert.equal(changed.status, 200)
  assert.notEqual(batches[0].key, batches[2].key)

  const invalid = await fetch(url, { ...options, body: '{invalid' })
  assert.equal(invalid.status, 400)
  assert.equal(batches.length, 3)
  const missing = await fetch(url.replace('/api/contact', '/unknown'))
  assert.equal(missing.status, 404)
})
