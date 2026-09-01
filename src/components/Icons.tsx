/**
 * Icon system per Akvega Brand Guidelines 08:
 * 2px stroke at 24px, rounded ends, minimal internal detail.
 * Every icon here is drawn — never substitute emoji or a unicode glyph.
 */
type IconProps = { className?: string }

function Svg({ className = '', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

const icons = {
  search: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.4-4.4M10.5 7.5v6M7.5 10.5h6" />
    </Svg>
  ),
  target: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 1.5v3M12 19.5v3M22.5 12h-3M4.5 12h-3" />
    </Svg>
  ),
  spark: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3 14 9.5 20.5 11.5 14 13.5 12 20 10 13.5 3.5 11.5 10 9.5Z" />
    </Svg>
  ),
  chat: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 15V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8Z" />
      <path d="M9 17h8a2 2 0 0 0 2-2V9" />
    </Svg>
  ),
  browser: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01" />
    </Svg>
  ),
  bag: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4.5 8h15l-1 12h-13Z" />
      <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" />
    </Svg>
  ),
  mobile: (p: IconProps) => (
    <Svg {...p}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </Svg>
  ),
  layers: (p: IconProps) => (
    <Svg {...p}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    </Svg>
  ),
  sliders: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 21v-7M5 10V3M12 21v-11M12 6V3M19 21v-4M19 13V3" />
      <path d="M2.5 14h5M9.5 10h5M16.5 17h5" />
    </Svg>
  ),
  /* Identity: two primitives in composition. Deliberately abstract — a brand
     is a system, not a paintbrush. */
  brand: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="9" r="5.5" />
      <rect x="9.5" y="9.5" width="10" height="10" rx="2.5" />
    </Svg>
  ),
  trend: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3.5 20.5h17" />
      <path d="m5.5 16 4.5-5 3.5 3.5L20 7" />
      <path d="M15.5 7H20v4.5" />
    </Svg>
  ),
  arrowDown: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </Svg>
  ),
  plus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  arrowUpRight: (p: IconProps) => (
    <Svg {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Svg>
  ),
  mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 5 8-5" />
    </Svg>
  ),
  phone: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3l3 1a1 1 0 0 1 .7 1v3a1 1 0 0 1-1 1C10.6 21.9 2.1 13.4 2.1 4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 .7l1 3c.1.4 0 .8-.3 1.1Z" />
    </Svg>
  ),
  clock: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </Svg>
  ),
  pin: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 21.5s7-6.4 7-12A7 7 0 0 0 5 9.5c0 5.6 7 12 7 12Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Svg>
  ),
  linkedin: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M8 11v6M8 7.6h.01M12 17v-3.4a2.4 2.4 0 0 1 4.8 0V17" />
    </Svg>
  ),
  instagram: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </Svg>
  ),
  dribbble: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 6.2c4.6 3.8 7.6 8.9 8.6 14.4M3.2 13.2c5.5-1 10.6.4 14.6 3.5M8.9 3.4c3.4 3.5 8.2 5.2 12.1 4.6" />
    </Svg>
  ),
} as const

export type IconName = keyof typeof icons

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name]
  return <Component className={className} />
}
