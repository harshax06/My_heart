import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import heartImg from '../../assets/images/transition-heart.webp'

/**
 * A small heart-shaped photo that sits between story sections.
 * It beats gently and glows, so one scene hands over to the next
 * through her instead of through empty space.
 */
export default function HeartDivider({ size = 88 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center py-14 overflow-hidden"
      style={{ background: '#0a0a0f' }}
      aria-hidden="true"
    >
      {/* thin rule that grows out from the heart on both sides */}
      <motion.div
        className="absolute h-px"
        initial={{ width: 0, opacity: 0 }}
        animate={inView ? { width: 'min(520px, 70vw)', opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(233,30,140,0.35), transparent)',
        }}
      />

      {/* soft bloom behind the heart */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 2.6,
          height: size * 2.6,
          background:
            'radial-gradient(circle, rgba(233,30,140,0.18) 0%, transparent 65%)',
          filter: 'blur(18px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.4, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ width: size }}
      >
        <motion.div
          animate={reduced ? {} : { scale: [1, 1.07, 1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="heart-clip overflow-hidden w-full">
            <img
              src={heartImg}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.05) contrast(1.02)' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
