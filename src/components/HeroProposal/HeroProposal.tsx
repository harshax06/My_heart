import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { config } from '../../data/config'
import SinglePlayGif from '../SinglePlayGif/SinglePlayGif'
import { initLandingAudio } from '../../utils/audioManager'

const FIREFLIES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 90 + 5}%`,
  y: `${Math.random() * 70 + 10}%`,
  duration: `${6 + Math.random() * 6}s`,
  delay: `${Math.random() * 4}s`,
  tx: `${(Math.random() - 0.5) * 80}px`,
  ty: `${-(Math.random() * 80 + 40)}px`,
  tx2: `${(Math.random() - 0.5) * 60}px`,
  ty2: `${-(Math.random() * 120 + 80)}px`,
}))

const textVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export default function HeroProposal() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  // Track whether audio init has been called to prevent StrictMode double-call
  const audioInitRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return
      const y = window.scrollY
      parallaxRef.current.style.transform = `translateY(${y * 0.4}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Start kalava.mp3 exactly once when landing page mounts
    if (audioInitRef.current) return
    audioInitRef.current = true
    initLandingAudio()
  }, [])

  const scrollDown = () => {
    document.getElementById('birthday')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#0a0505' }}
    >
      {/* Parallax background — SinglePlayGif plays ezgif.com-optimize (1).gif once then freezes.
          Full-bleed cover so the GIF fills the entire landing screen. */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform bg-black">
        <SinglePlayGif
          src="/ezgif.com-optimize (1).gif"
          alt="Proposal animation"
          fit="cover"
          className="w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {/* Sunset gradient overlay */}
      <div
        className="absolute inset-0 sunset-shimmer pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10,5,5,0.85) 0%, rgba(180,80,20,0.25) 40%, rgba(10,5,5,0.1) 70%, rgba(10,5,5,0.55) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,5,0.7) 100%)',
        }}
      />

      {/* Ocean wave SVG overlay */}
      <div className="ocean-layer pointer-events-none" style={{ bottom: 0, height: '120px' }}>
        <svg
          className="wave-svg"
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '80px' }}
        >
          <path
            fill="rgba(180,110,50,0.25)"
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
        <svg
          className="wave-svg-2"
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '60px', marginTop: '-40px' }}
        >
          <path
            fill="rgba(200,130,60,0.15)"
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
          />
        </svg>
      </div>

      {/* Fireflies */}
      {FIREFLIES.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            left: f.x,
            top: f.y,
            '--duration': f.duration,
            '--delay': f.delay,
            '--tx': f.tx,
            '--ty': f.ty,
            '--tx2': f.tx2,
            '--ty2': f.ty2,
          } as React.CSSProperties}
        />
      ))}

      {/* Glowing ring box pulse */}
      <motion.div
        className="absolute"
        style={{
          left: '48%',
          top: '52%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,100,0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating small heart above ring */}
      <motion.div
        className="absolute text-2xl"
        style={{ left: '50%', top: '44%', translateX: '-50%' }}
        animate={{
          y: [-8, -20, -8],
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ❤️
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        <motion.p
          className="font-serif text-gold text-xl md:text-2xl tracking-widest uppercase mb-4"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.5 }}
          style={{ letterSpacing: '0.3em' }}
        >
          A Story For You
        </motion.p>

        <motion.h1
          className="font-serif text-cream glow-white mb-6"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', lineHeight: 1.1, fontWeight: 300, fontStyle: 'italic' }}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          {config.hero.line1}
        </motion.h1>

        <motion.p
          className="font-serif text-blush text-xl md:text-2xl mb-4"
          style={{ fontStyle: 'italic', fontWeight: 300 }}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 2.5 }}
        >
          {config.hero.line2}
        </motion.p>

        <motion.p
          className="font-serif text-cream text-2xl md:text-3xl mb-12 glow-white"
          style={{ fontStyle: 'italic', fontWeight: 400 }}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 4 }}
        >
          {config.hero.line3}
        </motion.p>

        <motion.button
          onClick={scrollDown}
          className="font-sans text-sm tracking-widest uppercase px-10 py-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(233,30,140,0.25), rgba(244,168,73,0.25))',
            border: '1px solid rgba(244,168,73,0.5)',
            color: '#ffd166',
            letterSpacing: '0.25em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.5, duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 30px rgba(244,168,73,0.4)',
            background: 'linear-gradient(135deg, rgba(233,30,140,0.4), rgba(244,168,73,0.4))',
          }}
          whileTap={{ scale: 0.97 }}
          aria-label="Start our story - scroll down"
        >
          {config.hero.cta}
        </motion.button>
      </div>

      {/* Cinematic bars top/bottom */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,5,5,0.8), transparent)' }} />
    </section>
  )
}
