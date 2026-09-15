import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { config } from '../../data/config'

export default function LoveCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const colors = [
    { bg: 'rgba(233,30,140,0.08)', border: 'rgba(233,30,140,0.3)', glow: 'rgba(233,30,140,0.2)' },
    { bg: 'rgba(244,168,73,0.08)', border: 'rgba(244,168,73,0.3)', glow: 'rgba(244,168,73,0.2)' },
    { bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.3)', glow: 'rgba(124,58,237,0.2)' },
    { bg: 'rgba(249,168,212,0.08)', border: 'rgba(249,168,212,0.3)', glow: 'rgba(249,168,212,0.2)' },
    { bg: 'rgba(233,30,140,0.1)', border: 'rgba(233,30,140,0.5)', glow: 'rgba(233,30,140,0.3)' },
  ]

  return (
    <section
      id="love-cards"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0c0d18 50%, #0a0a0f 100%)',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-serif text-blush text-sm tracking-widest uppercase mb-4 text-center"
        style={{ letterSpacing: '0.3em' }}
      >
        Things I want you to know
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="font-serif gradient-text-rose text-center mb-16"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 500, fontStyle: 'italic' }}
      >
        About you, Bangaram
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {config.loveCards.map((text, i) => {
          const c = colors[i % colors.length]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: (i % 2 === 0 ? -1 : 1) * 2 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.04,
                rotate: (i % 2 === 0 ? -1 : 1) * 1,
                boxShadow: `0 0 30px ${c.glow}, 0 20px 60px rgba(0,0,0,0.5)`,
                y: -8,
              }}
              className="relative rounded-2xl p-8 cursor-default"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Index number */}
              <span
                className="absolute top-4 right-5 font-serif text-4xl font-bold"
                style={{ color: c.border, opacity: 0.3 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Heart icon */}
              <div className="text-3xl mb-4">
                {['❤️', '💕', '✨', '🌸', '💫'][i % 5]}
              </div>

              <p
                className="font-serif text-cream"
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {text}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
