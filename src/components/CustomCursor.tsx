import { useEffect, useRef } from 'react'

const interactiveSelector = [
  'a',
  'button',
  '[role="button"]',
  'summary',
  'select',
  '.press',
  '.card-lift',
  '.link-sweep',
  '[data-platform-tile]',
  '[data-cursor-hover]',
].join(',')

const textSelector = 'input, textarea, [contenteditable="true"]'

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches) return

    const root = cursor.current
    const dotElement = dot.current
    const ringElement = ring.current
    if (!root || !dotElement || !ringElement) return

    document.documentElement.classList.add('has-custom-cursor')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let activeTarget: HTMLElement | null = null
    let frame = 0

    const render = () => {
      let ringTargetX = targetX
      let ringTargetY = targetY

      if (activeTarget?.isConnected) {
        const bounds = activeTarget.getBoundingClientRect()
        const styles = window.getComputedStyle(activeTarget)
        const padding = 6
        const radius = Math.min(
          Number.parseFloat(styles.borderTopLeftRadius || '0') + padding,
          (bounds.height + padding * 2) / 2,
        )

        ringTargetX = bounds.left + bounds.width / 2
        ringTargetY = bounds.top + bounds.height / 2
        ringElement.style.setProperty(
          '--cursor-ring-width',
          `${bounds.width + padding * 2}px`,
        )
        ringElement.style.setProperty(
          '--cursor-ring-height',
          `${bounds.height + padding * 2}px`,
        )
        ringElement.style.setProperty('--cursor-ring-radius', `${radius}px`)
      } else {
        activeTarget = null
        ringElement.style.removeProperty('--cursor-ring-width')
        ringElement.style.removeProperty('--cursor-ring-height')
        ringElement.style.removeProperty('--cursor-ring-radius')
      }

      const followSpeed = activeTarget ? 0.24 : 0.18
      ringX += (ringTargetX - ringX) * followSpeed
      ringY += (ringTargetY - ringY) * followSpeed

      dotElement.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      ringElement.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frame = window.requestAnimationFrame(render)
    }

    const updateMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const isText = Boolean(element?.closest(textSelector))
      const isExcluded = Boolean(element?.closest('[data-cursor-none]'))
      activeTarget =
        isText || isExcluded
          ? null
          : (element?.closest<HTMLElement>(interactiveSelector) ?? null)
      root.dataset.visible = isText ? 'false' : 'true'
      root.dataset.active = activeTarget ? 'true' : 'false'
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      updateMode(event.target)
    }

    const onPointerOver = (event: PointerEvent) => updateMode(event.target)
    const onPointerDown = () => {
      root.dataset.pressed = 'true'
    }
    const onPointerUp = () => {
      root.dataset.pressed = 'false'
    }
    const onPointerLeave = () => {
      root.dataset.visible = 'false'
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerup', onPointerUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    frame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerUp)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      ref={cursor}
      aria-hidden="true"
      data-visible="false"
      data-active="false"
      data-pressed="false"
      className="custom-cursor"
    >
      <span ref={ring} className="custom-cursor__ring" />
      <span ref={dot} className="custom-cursor__dot" />
    </div>
  )
}
