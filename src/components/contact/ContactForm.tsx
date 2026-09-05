import { cloneElement, isValidElement, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { Icon } from '@/components/Icons'
import { track } from '@/lib/analytics'
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
 * Submits to Firebase; Resend credentials stay on the server.
 */
type FormState = {
  name: string
  email: string
  company: string
  interest: '' | 'technology' | 'digital'
  message: string
}

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  interest: '',
  message: '',
}
const emailPattern = /^\S+@\S+\.\S+$/

const interestOptions = [
  {
    value: 'technology',
    label: 'Technology',
    description: 'Web, apps & systems',
  },
  {
    value: 'digital',
    label: 'Digital',
    description: 'Search, ads & social',
  },
] as const

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
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [website, setWebsite] = useState('')

  // A ref, not state: the top of the funnel is reported once and must not
  // cause a render — retyping a name is not a second inquiry.
  const started = useRef(false)

  const update = (patch: Partial<FormState>) => {
    if (!started.current) {
      started.current = true
      track('contact_form_start', { form_name: 'contact' })
    }

    // Which track a visitor wants is the most useful thing this form knows,
    // and it is answered before they finish typing.
    if (patch.interest) {
      track('select_content', {
        content_type: 'service_interest',
        item_id: patch.interest,
      })
    }

    setData((current) => ({ ...current, ...patch }))
  }

  const emailValid = emailPattern.test(data.email.trim())
  const emailError = emailTouched && data.email.trim().length > 0 && !emailValid
  const canSend =
    data.name.trim().length > 0 &&
    emailValid &&
    data.interest.length > 0 &&
    data.message.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend || sending) return
    setSending(true)
    setSubmitError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website }),
        signal: AbortSignal.timeout(25000),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        track('contact_form_error', {
          form_name: 'contact',
          reason: response.status === 429 ? 'rate_limited' : `http_${response.status}`,
        })
        setSubmitError(response.status === 429
          ? 'Too many attempts. Please try again in 10 minutes.'
          : 'Your message could not be sent. Please try again or email us directly.')
        return
      }
      // Shape, never content: that an inquiry happened and which track it was
      // for. Name, email and message go to the API and never to analytics.
      track('generate_lead', {
        form_name: 'contact',
        interest: data.interest,
        has_company: data.company.trim().length > 0,
      })

      setSent(true)
      setData(initialState)
    } catch {
      track('contact_form_error', {
        form_name: 'contact',
        reason: 'network_or_invalid_response',
      })
      setSubmitError('We could not confirm your message was sent. Please check your connection or email us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-2xl border border-hairline bg-paper p-6 shadow-[0_1px_2px_rgb(5_17_39/0.05),0_24px_48px_-28px_rgb(5_17_39/0.32)] sm:p-8">
      <h2 className="type-card-title">Get in touch</h2>
      <p className="type-body mt-2 text-ink-muted">
        Tell us what you're trying to solve — no proposal until we know the
        answer.
      </p>

      {!sent ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" aria-busy={sending} noValidate>
          <div hidden aria-hidden="true">
            <label>
              Website
              <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <Field label="Full name">
            <input
              type="text"
              value={data.name}
              maxLength={120}
              disabled={sending}
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
              maxLength={254}
              disabled={sending}
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
              maxLength={200}
              disabled={sending}
              onChange={(e) => update({ company: e.target.value })}
              placeholder="Company name"
              className={fieldClass}
              autoComplete="organization"
            />
          </Field>
          <fieldset>
            <legend className="type-ui text-ink-muted">
              What do you need help with?
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {interestOptions.map((option) => {
                const selected = data.interest === option.value

                return (
                  <label
                    key={option.value}
                    className={`press cursor-pointer rounded-xl border px-4 py-3.5 transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${
                      selected
                        ? 'border-navy bg-navy text-white'
                        : 'border-hairline bg-surface/60 text-ink hover:border-blue-300 hover:bg-paper'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={option.value}
                      checked={selected}
                      disabled={sending}
                      onChange={() => update({ interest: option.value })}
                      className="sr-only"
                      required
                    />
                    <span className="block text-[15px] font-semibold leading-tight">
                      {option.label}
                    </span>
                    <span
                      className={`mt-1 block text-[13px] leading-snug ${
                        selected ? 'text-white/70' : 'text-ink-muted'
                      }`}
                    >
                      {option.description}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <Field label="Message">
            <textarea
              value={data.message}
              maxLength={5000}
              disabled={sending}
              onChange={(e) => update({ message: e.target.value })}
              placeholder="A line or two is plenty — we'll ask the rest in the diagnostic."
              rows={4}
              className={`${fieldClass} resize-none`}
            />
          </Field>

          {submitError && (
            <p role="alert" className="text-[14px] text-red-600">
              {submitError}{' '}
              <a href={`mailto:${site.email}`} className="underline">{site.email}</a>
            </p>
          )}
          <button
            type="submit"
            disabled={!canSend || sending}
            className="press type-ui flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-white shadow-[0_10px_30px_-12px_var(--color-signal)] hover:shadow-[0_16px_36px_-12px_var(--color-signal)] disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="arrowUpRight" className="size-4" />
            {sending ? 'Sending...' : 'Send a message'}
          </button>
        </form>
      ) : (
        <div role="status" className="mt-8 rounded-lg bg-surface p-5">
          <p className="type-card-title text-[1.15rem]">Message sent.</p>
          <p className="type-body mt-2 text-ink-muted">
            Thanks for getting in touch. A confirmation is on its way to your inbox.
            Our team will review your message and reply to the email address you provided.
          </p>
        </div>
      )}
    </div>
  )
}
