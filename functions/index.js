import { onRequest } from 'firebase-functions/v2/https'
import { createContactHandler } from './contact.js'
import { getContactConfig } from './config.js'

export const contact = onRequest(
  {
    region: 'us-central1',
    invoker: 'public',
    maxInstances: 1,
    concurrency: 10,
    timeoutSeconds: 30,
    memory: '256MiB',
  },
  createContactHandler({
    getConfig: getContactConfig,
  }),
)
