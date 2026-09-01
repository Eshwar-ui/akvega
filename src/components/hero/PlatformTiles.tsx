import { TechIcon } from '@/components/TechStack'
import { techMarks, type TechMark } from '@/lib/tech'

/**
 * Tech-stack tiles for the hero: white rounded squares, soft drop shadow,
 * scattered tilt and vertical offset per the supplied reference. Unlike the
 * social-channel marks these replaced, these come straight from the
 * TechIcon/lib/tech pipeline (Simple Icons, CC0) — real assets already, not
 * a drawn placeholder to swap before launch.
 *
 * Rendered at full brand colour rather than the monochrome-until-hover
 * treatment TechStack.tsx uses elsewhere: five flat brand hues read as a
 * confident, colourful accent here, which is the point of this row.
 */
type Tile = {
  name: string
  tilt: number
  lift: number
  markId: string
}

const tiles: Tile[] = [
  { name: 'React', tilt: -10, lift: 56, markId: 'react' },
  { name: 'Next.js', tilt: 8, lift: 0, markId: 'nextdotjs' },
  { name: 'Node.js', tilt: -7, lift: 78, markId: 'nodedotjs' },
  { name: 'TypeScript', tilt: 7, lift: 12, markId: 'typescript' },
  { name: 'Stripe', tilt: -6, lift: 40, markId: 'stripe' },
]

const marks: { tile: Tile; mark: TechMark }[] = tiles
  .map((tile) => {
    const mark = techMarks.find((m) => m.id === tile.markId)
    return mark ? { tile, mark } : null
  })
  .filter((entry): entry is { tile: Tile; mark: TechMark } => Boolean(entry))

export default function PlatformTiles() {
  return (
    <ul className="mt-[clamp(1.5rem,5vh,3rem)] flex flex-nowrap items-start justify-center gap-x-3 sm:gap-x-6 lg:gap-x-10 xl:absolute xl:inset-x-0 xl:bottom-4 xl:mt-0">
      {marks.map(({ tile, mark }, i) => (
        <li
          key={tile.name}
          style={{
            rotate: `${tile.tilt}deg`,
            marginTop: `${tile.lift * 0.25}px`,
          }}
          data-platform-tile
          data-depth={0.3 + i * 0.07}
          className="will-change-transform transition-[rotate,translate] duration-500 ease-out-expo hover:!rotate-0 hover:-translate-y-1"
        >
          <span data-platform-enter className="block will-change-transform">
            <span
              title={tile.name}
              data-pointer-layer
              style={{ '--brand': mark.hex } as React.CSSProperties}
              className="grid size-[48px] place-items-center rounded-[14px] bg-white shadow-[0_2px_4px_rgb(5_17_39/0.05),0_16px_32px_-12px_rgb(5_17_39/0.3)] transition-shadow duration-500 ease-out-expo hover:shadow-[0_4px_8px_rgb(5_17_39/0.07),0_28px_48px_-14px_rgb(5_17_39/0.36)] sm:size-[64px] sm:rounded-[18px] lg:size-[clamp(60px,8.5vh,78px)] lg:rounded-[20px]"
            >
              <TechIcon
                mark={mark}
                className="size-6 shrink-0 bg-[var(--brand)] sm:size-7 lg:size-9"
              />
              <span className="sr-only">{tile.name}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
