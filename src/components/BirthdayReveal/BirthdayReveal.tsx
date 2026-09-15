import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import { config } from '../../data/config'

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = 1000 / 60
    const increment = target / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)

    return () => clearInterval(timer)
  }, [inView, target])

  return <>{count}</>
}

export default function BirthdayReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const confettiFired = useRef(false)

  useEffect(() => {
    if (inView && !confettiFired.current) {
      confettiFired.current = true
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#e91e8c', '#f4a849', '#f9a8d4', '#ffd166', '#7c3aed'],
          ticks: 200,
        })
      }, 1500)
    }
  }, [inView])

  const lineVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: i * 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <section
      id="birthday"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0d0510 0%, #150a20 40%, #0a0a0f 100%)',
      }}
    >
      {/* Top transition fade */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,5,5,1), transparent)' }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '600px', height: '600px',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h2
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-serif text-cream mb-2"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 300, fontStyle: 'italic' }}
        >
          {config.birthday.heading}
        </motion.h2>

        <motion.h2
          custom={1}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-serif gradient-text-rose mb-8"
          style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)', fontWeight: 600 }}
        >
          {config.birthday.name}
        </motion.h2>

        {/* Age number — dramatic */}
        <motion.div
          custom={2}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative inline-block mb-10"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(233,30,140,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          <div
            className="font-serif gradient-text-gold relative"
            style={{
              fontSize: 'clamp(7rem, 25vw, 16rem)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
            }}
          >
            <CountUp target={config.birthday.age} inView={inView} />
          </div>

          {/* Floating hearts around 20 */}
          {['❤️', '💕', '✨', '🌸', '❤️'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-xl md:text-2xl pointer-events-none select-none"
              style={{
                left: `${[110, 120, -30, -15, 115][i]}%`,
                top: `${[10, 70, 20, 75, 45][i]}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [-5, 5, -5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtext lines */}
        <div className="space-y-3">
          {config.birthday.subtext.map((line, i) => (
            <motion.p
              key={i}
              custom={i + 3}
              variants={lineVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="font-serif text-blush"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 300, fontStyle: 'italic' }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Decorative divider */}
        <motion.div
          custom={6}
          variants={lineVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div className="h-px w-24 md:w-40" style={{ background: 'linear-gradient(to right, transparent, rgba(233,30,140,0.5))' }} />
          <span className="text-2xl">❤️</span>
          <div className="h-px w-24 md:w-40" style={{ background: 'linear-gradient(to left, transparent, rgba(233,30,140,0.5))' }} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
