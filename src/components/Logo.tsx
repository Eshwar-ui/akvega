type LogoProps = {
  className?: string
}

/**
 * Brand assets live in /public as SVG. They carry their own gradient, so they
 * are rendered as images rather than inlined and recolored.
 */
export function LogoMark({ className = '' }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
    />
  )
}

export function LogoFull({ className = '' }: LogoProps) {
  return (
    <img
      src="/full-logo.svg"
      alt="AKVEGA"
      draggable={false}
      className={className}
    />
  )
}
