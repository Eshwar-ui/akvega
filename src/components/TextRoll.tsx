/**
 * A label that rolls over on hover: the word is drawn twice in a clipped box
 * and the pair slides up one line, so the copy below lands where the original
 * was.
 *
 * The second copy is aria-hidden — it is the same word, and a screen reader
 * announcing every nav item twice is the obvious failure here.
 *
 * Takes a string rather than ReactNode on purpose: the effect depends on the
 * two copies being one line of identical text.
 */
export default function TextRoll({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll-inner">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
