import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Wraps a section and gives it a cinematic scroll transition:
 * it drifts up, lifts out of a soft blur, and dims slightly as it leaves
 * the viewport — so sections feel like shots dissolving into each other
 * rather than blocks stacked on a page.
 *
 * Respects prefers-reduced-motion (renders children untouched).
 */
export default function SceneTransition({
  children,
  intensity = 1,
}: {
  children: ReactNode
  /** 0 = subtle, 1 = default, 2 = dramatic */
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60 * intensity, 0, -40 * intensity])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.35])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.99])
  const filter = useTransform(
    scrollYProgress,
    [0, 0.18, 0.85, 1],
    ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)']
  )

  if (reduced) return <div ref={ref}>{children}</div>

  return (
    <motion.div ref={ref} style={{ y, opacity, scale, filter, willChange: 'transform, opacity, filter' }}>
      {children}
    </motion.div>
  )
}
