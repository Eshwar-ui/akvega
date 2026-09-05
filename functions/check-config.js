import { loadEnvFile } from 'node:process'

try {
  loadEnvFile(new URL('./.env', import.meta.url))
} catch {
  console.error('Create functions/.env from functions/.env.example before deploying.')
  process.exit(1)
}
const missing = ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO'].filter((key) => !process.env[key]?.trim())
if (missing.length) {
  console.error(`Set ${missing.join(', ')} in functions/.env before deploying.`)
  process.exit(1)
}
