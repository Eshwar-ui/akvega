import type { ReactNode } from 'react'
import { useInView, revealDelay } from '@/lib/useInView'

type SectionProps = {
  id?: string
  title?: string
  children?: ReactNode
  className?: string
}

export default function Section({
  id,
  title,
  children,
  className = '',
}: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      ref={ref}
      data-shown={inView}
      id={id}
      className={`mx-auto max-w-site px-5 py-24 sm:px-8 ${className}`}
    >
      {title && (
        <h1 className="reveal type-page-title mb-8">
          {title}
        </h1>
      )}
      <div className="reveal" style={revealDelay(1)}>
        {children}
      </div>
    </section>
  )
}
