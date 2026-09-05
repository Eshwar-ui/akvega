import { writeFile } from 'node:fs/promises'
import { inquiryHtml, acknowledgementHtml } from '../functions/contact.js'

const inquiry = inquiryHtml({
  name: 'Jordan Ellis',
  email: 'jordan@example.com',
  company: 'Northstar Labs',
  interest: 'technology',
  message: 'We need a sharper product site and a system that can scale with the team.',
})
const acknowledgement = acknowledgementHtml('Jordan Ellis')
const page = `<!doctype html><html><head><meta charset="utf-8"><title>Akvega email templates</title><style>body{margin:0;background:#dce8f3;font:14px Arial;color:#06152e}header{padding:28px 32px;background:#06152e;color:#fff}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:24px;padding:24px}section{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px #06152e22}h2{margin:0;padding:18px 22px;font-size:16px}iframe{display:block;width:100%;height:670px;border:0;border-top:1px solid #dfe7f0}</style></head><body><header><strong>Akvega email templates</strong><div style="opacity:.7;margin-top:6px">Rendered preview · sample data only</div></header><main><section><h2>New request received</h2><iframe title="New request email" srcdoc="${inquiry.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}"></iframe></section><section><h2>Acknowledgment to visitor</h2><iframe title="Acknowledgment email" srcdoc="${acknowledgement.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}"></iframe></section></main></body></html>`
await writeFile('.codex-artifacts/email-preview.html', page)
console.log('Wrote .codex-artifacts/email-preview.html')
