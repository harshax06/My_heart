import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { config } from '../../data/config'

export default function LoveMessage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const lineVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: i * 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <section
      id="love-message"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0515 50%, #0a0a0f 100%)',
      }}
    >
      {/* Ambient purple glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '70vw', height: '70vw', maxWidth: '700px', maxHeight: '700px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? 'rgba(233,30,140,0.7)' : 'rgba(244,168,73,0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Love lines */}
        <div className="space-y-4 mb-14">
          {config.loveMessage.lines.map((line, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="font-serif text-cream"
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                fontWeight: i === 0 ? 400 : 300,
                fontStyle: 'italic',
                opacity: 1,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Heartbeat SVG */}
        <motion.div
          custom={config.loveMessage.lines.length}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex justify-center mb-10"
        >
          <motion.svg
            viewBox="0 0 100 100"
            width="120"
            height="120"
            className="heartbeat-anim"
            aria-hidden="true"
          >
            {/* Outer glow */}
            <defs>
              <filter id="heartGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 85 L15 50 C10 40 10 25 20 20 C30 15 40 20 50 30 C60 20 70 15 80 20 C90 25 90 40 85 50 Z"
              fill="#e91e8c"
              filter="url(#heartGlow)"
            />
            {/* Inner highlight */}
            <path
              d="M50 38 C53 30 60 25 67 27 C74 29 76 36 72 43"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* Footer message */}
        <motion.p
          custom={config.loveMessage.lines.length + 1}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-serif gradient-text-rose"
          style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 500 }}
        >
          {config.loveMessage.footer}
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
