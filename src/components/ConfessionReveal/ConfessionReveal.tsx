import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { playTrack } from '../../utils/audioManager'

const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
  size: 2 + Math.random() * 3,
}))

const textLines = [
  'Before I say anything else...',
  'I want you to know something.',
  'Something I\'ve been carrying in my heart.',
]

export default function ConfessionReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  // Guard: only switch to proposal music once
  const audioSwitchedRef = useRef(false)

  // When the section comes into view, stop kalava and start proposal.mp3
  if (inView && !audioSwitchedRef.current) {
    audioSwitchedRef.current = true
    playTrack('proposal')
  }

  return (
    <section
      id="confession"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0818 30%, #120a1a 60%, #0a0a0f 100%)',
      }}
    >
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0a0a0f, transparent)' }}
      />

      {/* Ambient sparkles */}
      {SPARKLES.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: 'rgba(233, 30, 140, 0.6)',
            boxShadow: '0 0 6px rgba(233, 30, 140, 0.4)',
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
        {/* Decorative top element */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-4xl">💭</span>
        </motion.div>

        {/* Text lines with staggered reveal */}
        {textLines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{
              duration: 1,
              delay: 0.5 + i * 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-cream mb-4"
            style={{
              fontSize: i === 2 ? 'clamp(1.4rem, 4vw, 2.2rem)' : 'clamp(1.1rem, 3vw, 1.6rem)',
              fontStyle: 'italic',
              fontWeight: i === 2 ? 400 : 300,
              lineHeight: 1.6,
            }}
          >
            {line}
          </motion.p>
        ))}

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 3 }}
          className="flex items-center justify-center gap-4 mt-8 mb-12"
        >
          <div
            className="h-px w-20 md:w-32"
            style={{ background: 'linear-gradient(to right, transparent, rgba(124, 58, 237, 0.5))' }}
          />
          <span className="text-xl">✨</span>
          <div
            className="h-px w-20 md:w-32"
            style={{ background: 'linear-gradient(to left, transparent, rgba(124, 58, 237, 0.5))' }}
          />
        </motion.div>
      </div>

      {/* GIF Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full flex justify-center"
      >
        {/* Glow behind the GIF */}
        <motion.div
          className="absolute rounded-3xl"
          style={{
            width: '110%',
            height: '110%',
            left: '-5%',
            top: '-5%',
            background: 'radial-gradient(circle, rgba(233, 30, 140, 0.15) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* The GIF in a premium frame */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            maxWidth: 'min(600px, 90vw)',
            border: '2px solid rgba(233, 30, 140, 0.2)',
            boxShadow: `
              0 0 30px rgba(233, 30, 140, 0.15),
              0 0 60px rgba(124, 58, 237, 0.1),
              inset 0 0 30px rgba(0, 0, 0, 0.3)
            `,
          }}
        >
          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
            style={{
              borderTop: '2px solid rgba(244, 168, 73, 0.4)',
              borderLeft: '2px solid rgba(244, 168, 73, 0.4)',
            }}
          />
          <div
            className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
            style={{
              borderTop: '2px solid rgba(244, 168, 73, 0.4)',
              borderRight: '2px solid rgba(244, 168, 73, 0.4)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none"
            style={{
              borderBottom: '2px solid rgba(244, 168, 73, 0.4)',
              borderLeft: '2px solid rgba(244, 168, 73, 0.4)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
            style={{
              borderBottom: '2px solid rgba(244, 168, 73, 0.4)',
              borderRight: '2px solid rgba(244, 168, 73, 0.4)',
            }}
          />

          <img
            src="/ezgif.com-optimize.gif"
            alt="A special moment"
            loading="lazy"
            className="w-full"
            style={{ display: 'block', filter: 'brightness(0.95) saturate(1.1)' }}
          />
        </div>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 4.5 }}
        className="relative z-10 font-serif text-blush text-center mt-10"
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          opacity: 0.8,
        }}
      >
        One more scroll, Bangaram... this is the part I've been waiting for ❤️
      </motion.p>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }}
      />
    </section>
  )
}
