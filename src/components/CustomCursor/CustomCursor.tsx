import { useEffect, useRef, useState } from 'react'

/**
 * Cinematic custom cursor:
 *  - a small solid dot that tracks the pointer exactly
 *  - a larger soft ring that lags behind (spring trail)
 *  - ring expands + glows over interactive elements
 *  - a ripple burst on click
 * Disabled entirely on touch devices and when prefers-reduced-motion is set.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)
    document.body.classList.add('has-custom-cursor')
    return () => document.body.classList.remove('has-custom-cursor')
  }, [])

  useEffect(() => {
    if (!enabled) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
      const el = e.target as HTMLElement | null
      setHovering(
        !!el?.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')
      )
    }

    const onClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random()
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 650)
    }

    // Spring-follow loop for the trailing ring
    const tick = () => {
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* exact-tracking dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#f9a8d4',
          boxShadow: '0 0 10px rgba(233,30,140,0.9)',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovering ? 54 : 30,
          height: hovering ? 54 : 30,
          borderRadius: '50%',
          border: `1px solid rgba(244,168,73,${hovering ? 0.9 : 0.5})`,
          background: hovering
            ? 'radial-gradient(circle, rgba(233,30,140,0.14) 0%, transparent 70%)'
            : 'transparent',
          boxShadow: hovering ? '0 0 22px rgba(244,168,73,0.35)' : 'none',
          pointerEvents: 'none',
          zIndex: 9999,
          transition:
            'width 0.28s cubic-bezier(0.22,1,0.36,1), height 0.28s cubic-bezier(0.22,1,0.36,1), border-color 0.28s ease, box-shadow 0.28s ease, background 0.28s ease',
        }}
      />

      {/* click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="cursor-ripple"
          style={{ position: 'fixed', left: r.x, top: r.y, zIndex: 9998 }}
        />
      ))}
    </>
  )
}
