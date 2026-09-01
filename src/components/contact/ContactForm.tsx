import { cloneElement, isValidElement, useId, useState } from 'react'
import type { ReactElement } from 'react'
import { Icon } from '@/components/Icons'
import { site } from '@/lib/site'

/**
 * A single card, four fields, one button — the shape of the user-supplied
 * reference layout, rebuilt in Akvega's own system rather than its dark,
 * photo-led one. Retired the earlier three-step wizard for it: a pinned
 * reference beats the prior structural roll (see DESIGN.md, "Contact page").
 *
 * Inputs are underlined rather than boxed — the one deliberate borrowing
 * from the reference's minimal editorial form, which reads as considered
 * rather than a stock input style, without introducing a new colour or type.
 *
 * Still no backend (PRODUCT.md): "Send a message" builds a mailto: from the
 * fields and hands off to the visitor's mail client — real today, swappable
 * for a real endpoint later.
 */
type FormState = {
  name: string
  email: string
  company: string
  message: string
}

const initialState: FormState = { name: '', email: '', company: '', message: '' }
const emailPattern = /^\S+@\S+\.\S+$/

function buildMailto(data: FormState) {
  const subject = `New project inquiry — ${data.company || data.name}`
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    '',
    data.message,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const fieldClass =
  'w-full border-0 border-b border-hairline bg-transparent px-0 pb-3 pt-1 text-[15px] text-ink placeholder:text-ink-muted focus-visible:border-blue-600'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean }>
}) {
  const id = useId()
  return (
    <label htmlFor={id} className="block">
      <span className="type-ui text-ink-muted">{label}</span>
      <span className="mt-1 block">
        {isValidElement(children)
          ? cloneElement(children, { id, 'aria-invalid': Boolean(error) })
          : children}
      </span>
      {error && (
        <span role="alert" className="mt-1.5 block text-[13px] text-red-600">
          {error}
        </span>
      )}
    </label>
  )
}

export default function ContactForm() {
  const [data, setData] = useState<FormState>(initialState)
  const [emailTouched, setEmailTouched] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (patch: Partial<FormState>) =>
    setData((current) => ({ ...current, ...patch }))

  const emailValid = emailPattern.test(data.email.trim())
  const emailError = emailTouched && data.email.trim().length > 0 && !emailValid
  const canSend =
    data.name.trim().length > 0 &&
    emailValid &&
    data.message.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    window.location.href = buildMailto(data)
    setSent(true)
  }

  return (
    <div className="rounded-2xl border border-hairline bg-paper p-6 shadow-[0_1px_2px_rgb(5_17_39/0.05),0_24px_48px_-28px_rgb(5_17_39/0.32)] sm:p-8">
      <h2 className="type-card-title">Get in touch</h2>
      <p className="type-body mt-2 text-ink-muted">
        Tell us what you're trying to solve — no proposal until we know the
        answer.
      </p>

      {!sent ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <Field label="Full name">
            <input
              type="text"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Jordan Ellis"
              className={fieldClass}
              autoComplete="name"
            />
          </Field>
          <Field
            label="Email"
            error={emailError ? 'Doesn’t look like a full email address.' : undefined}
          >
            <input
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              onBlur={() => setEmailTouched(true)}
              placeholder="jordan@company.com"
              className={`${fieldClass} ${emailError ? 'border-red-300' : ''}`}
              autoComplete="email"
            />
          </Field>
          <Field label="Company (optional)">
            <input
              type="text"
              value={data.company}
              onChange={(e) => update({ company: e.target.value })}
              placeholder="Company name"
              className={fieldClass}
              autoComplete="organization"
            />
          </Field>
          <Field label="Message">
            <textarea
              value={data.message}
              onChange={(e) => update({ message: e.target.value })}
              placeholder="A line or two is plenty — we'll ask the rest in the diagnostic."
              rows={4}
              className={`${fieldClass} resize-none`}
            />
          </Field>

          <button
            type="submit"
            disabled={!canSend}
            className="press type-ui flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-white shadow-[0_10px_30px_-12px_var(--color-signal)] hover:shadow-[0_16px_36px_-12px_var(--color-signal)] disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="arrowUpRight" className="size-4" />
            Send a message
          </button>
        </form>
      ) : (
        <div className="mt-8 rounded-lg bg-surface p-5">
          <p className="type-card-title text-[1.15rem]">Almost there.</p>
          <p className="type-body mt-2 text-ink-muted">
            Finish sending it from your email client. If nothing opened,
            write to us directly at{' '}
            <a href={`mailto:${site.email}`} className="link-sweep text-blue-700">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}
    </div>
  )
}
