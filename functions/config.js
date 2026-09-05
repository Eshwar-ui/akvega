// Firebase loads functions/.env at deployment; local scripts load the same file.
// These names must never have a VITE_ prefix or be imported by browser code.
export function getContactConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim(),
    from: process.env.CONTACT_FROM?.trim(),
    to: process.env.CONTACT_TO?.trim(),
  }
}
