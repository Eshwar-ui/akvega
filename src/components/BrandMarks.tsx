/**
 * Third-party brand marks, in each platform's own glyph and colour.
 *
 * These are deliberately NOT part of the Akvega icon system in Icons.tsx —
 * guidelines 08 governs our own 2px-stroke icons, and a brand mark must not be
 * redrawn to match a house style. Do not restroke, recolour, or outline these.
 *
 * NOTE: drawn from the standard public glyph outlines. Each platform's brand
 * guidelines require their official asset, so confirm before launch.
 */
type MarkProps = { className?: string }

const paths = {
  linkedin: {
    color: '#0A66C2',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  dribbble: {
    color: '#EA4C89',
    d: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.66.221c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z',
  },
  x: {
    color: '#000000',
    d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z',
  },
  youtube: {
    color: '#FF0000',
    d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  facebook: {
    color: '#1877F2',
    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
} as const

export type BrandName =
  | keyof typeof paths
  | 'instagram'
  | 'googleAds'
  | 'meta'

export function BrandMark({
  name,
  className = '',
}: MarkProps & { name: BrandName }) {
  // Instagram's mark is a gradient, so it needs its own defs rather than a fill.
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="brand-ig" cx="0.3" cy="1.05" r="1.15">
            <stop offset="0%" stopColor="#FDD35D" />
            <stop offset="30%" stopColor="#FA7E1E" />
            <stop offset="60%" stopColor="#D62976" />
            <stop offset="100%" stopColor="#6228D7" />
          </radialGradient>
        </defs>
        <rect
          x="2.2"
          y="2.2"
          width="19.6"
          height="19.6"
          rx="5.6"
          fill="none"
          stroke="url(#brand-ig)"
          strokeWidth="2.1"
        />
        <circle
          cx="12"
          cy="12"
          r="4.4"
          fill="none"
          stroke="url(#brand-ig)"
          strokeWidth="2.1"
        />
        <circle cx="17.4" cy="6.6" r="1.35" fill="url(#brand-ig)" />
      </svg>
    )
  }

  // Google Ads: the two diagonal bars and the terminal dot, in Google's hues.
  if (name === 'googleAds') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect
          x="9.3"
          y="3.4"
          width="5.4"
          height="15.2"
          rx="2.7"
          fill="#FBBC04"
          transform="rotate(30 12 5)"
        />
        <rect
          x="9.3"
          y="3.4"
          width="5.4"
          height="15.2"
          rx="2.7"
          fill="#4285F4"
          transform="rotate(-30 12 5)"
        />
        <circle cx="5.3" cy="16.7" r="3" fill="#34A853" />
      </svg>
    )
  }

  // Meta: the loop, stroked in the brand blue rather than filled.
  if (name === 'meta') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="brand-meta" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0081FB" />
            <stop offset="100%" stopColor="#0064E0" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#brand-meta)"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M2.7 13.6c0-5.1 2.6-7.7 5.4-7.7 2.9 0 4.8 3.1 6.5 6 1.4 2.3 2.3 3.8 3.8 3.8 1.4 0 2.1-1.2 2.1-3.3" />
          <path d="M21.3 13.6c0-5.1-2.6-7.7-5.4-7.7-2.9 0-4.8 3.1-6.5 6-1.4 2.3-2.3 3.8-3.8 3.8-1.4 0-2.1-1.2-2.1-3.3" />
        </g>
      </svg>
    )
  }

  const mark = paths[name]
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill={mark.color} d={mark.d} />
    </svg>
  )
}
