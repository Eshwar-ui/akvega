import { Icon } from '@/components/Icons'

/**
 * The reference's map embed pins a real office; Akvega has none (PRODUCT.md:
 * "remote-first · async across time zones"). Rather than fabricate a working
 * Google Maps embed around an address that doesn't exist, this is an
 * abstract line-art map — drawn in the house 2px-stroke language, not a
 * photoreal tile set standing in for a real location — with the location
 * card honestly labelled as illustrative.
 */
export default function MapPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 360"
        preserveAspectRatio="xMidYMid slice"
        className="h-[280px] w-full text-ink/10 sm:h-[340px]"
      >
        <line x1="0" y1="60" x2="800" y2="60" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="180" x2="800" y2="170" stroke="currentColor" strokeWidth="3" />
        <line x1="0" y1="300" x2="800" y2="310" stroke="currentColor" strokeWidth="2" />
        <line x1="120" y1="0" x2="150" y2="360" stroke="currentColor" strokeWidth="2" />
        <line x1="340" y1="0" x2="320" y2="360" stroke="currentColor" strokeWidth="3" />
        <line x1="560" y1="0" x2="580" y2="360" stroke="currentColor" strokeWidth="2" />
        <line x1="680" y1="0" x2="700" y2="360" stroke="currentColor" strokeWidth="2" />
        <circle cx="400" cy="180" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-11 place-items-center rounded-full bg-navy text-white shadow-[0_10px_24px_-8px_rgb(5_17_39/0.5)]">
          <Icon name="pin" className="size-5" />
        </span>
      </span>

      <div className="absolute left-4 top-4 max-w-[15rem] rounded-xl border border-hairline bg-paper p-4 shadow-[0_1px_2px_rgb(5_17_39/0.05),0_16px_32px_-16px_rgb(5_17_39/0.3)] sm:left-6 sm:top-6">
        <p className="text-[13px] font-medium text-ink">Akvega — remote-first</p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
          No fixed office yet — the team works async across time zones.
        </p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted">
          Illustrative map — not a real location
        </p>
      </div>
    </div>
  )
}
