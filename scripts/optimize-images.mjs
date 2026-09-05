/**
 * Converts the raster art in public/ to sized WebP.
 *
 *   npm run images
 *
 * Why this exists: the source PNGs were full-resolution exports — 1448×1086 and
 * 1672×941, ~1MB each, 18MB across the folder. Six of them render in the hero at
 * roughly 208px wide, eagerly, above the fold. That is the whole page weight
 * budget spent on decoration nobody can see at that resolution.
 *
 * Each set below declares the widths it is actually displayed at (2x the largest
 * CSS size, capped at the source's native width — upscaling buys nothing). The
 * PNG is removed once its WebP variants are written, so public/ holds only what
 * ships. Re-running is a no-op: with no PNGs left there is nothing to convert.
 *
 * To change a size or add art: drop the PNG back in the right folder and re-run.
 * Originals for anything already converted are in git history —
 *   git show <commit>:public/service-ui/<name>.png > /tmp/<name>.png
 *
 * Requires sharp, which is not a project dependency (this runs by hand, not on
 * every install):
 *   npm i --no-save sharp && npm run images
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SETS = [
  {
    dir: 'public/service-ui',
    // Hero workspace cards: 208–240px on desktop, up to ~330px in the mobile
    // two-up grid. 720w covers 2x of the largest of those.
    widths: [720],
    quality: 80,
  },
  {
    dir: 'public/service-media',
    // Bento cards. The featured slot runs 7 of 12 columns of a 95vw container,
    // so ~1060px CSS on a 1920px screen; the rest are far smaller. Two widths,
    // picked per card by `sizes`.
    widths: [768, 1440],
    quality: 76,
  },
]

let sharp
try {
  ;({ default: sharp } = await import('sharp'))
} catch {
  console.error(
    'sharp is not installed. Run:\n  npm i --no-save sharp && npm run images',
  )
  process.exit(1)
}

/** `foo.png` + width 720 -> `foo-720.webp`; a single-width set drops the suffix. */
const variantName = (base, width, single) =>
  single ? `${base}.webp` : `${base}-${width}.webp`

let written = 0
let removed = 0
let bytesBefore = 0
let bytesAfter = 0

for (const { dir, widths, quality } of SETS) {
  if (!existsSync(dir)) {
    console.warn(`skipped ${dir} (not found)`)
    continue
  }

  const pngs = (await readdir(dir)).filter((f) => f.endsWith('.png'))
  if (!pngs.length) {
    console.log(`${dir}: nothing to convert`)
    continue
  }

  for (const file of pngs) {
    const from = path.join(dir, file)
    const base = file.slice(0, -'.png'.length)
    // `metadata().size` is only populated for buffer inputs, so stat the file.
    const { width: sourceWidth } = await sharp(from).metadata()
    bytesBefore += (await stat(from)).size

    // Never upscale: a variant wider than the source is bytes for no pixels.
    const targets = [...new Set(widths.map((w) => Math.min(w, sourceWidth)))]
    const single = targets.length === 1

    for (const width of targets) {
      const to = path.join(dir, variantName(base, width, single))
      const info = await sharp(from)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(to)
      bytesAfter += info.size
      written += 1
      console.log(
        `  ${to}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
      )
    }

    await unlink(from)
    removed += 1
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2)
console.log(
  `\n${written} WebP written, ${removed} PNG removed — ` +
    `${mb(bytesBefore)}MB -> ${mb(bytesAfter)}MB`,
)
