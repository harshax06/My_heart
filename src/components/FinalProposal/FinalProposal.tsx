import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import { config } from '../../data/config'
import finalImg from '../../assets/images/final-reveal.webp'

type Step = 'idle' | 'ribbon-loose' | 'ribbon-away' | 'shaking' | 'opening' | 'message' | 'celebration'

function fireworks() {
  const duration = 4000
  const end = Date.now() + duration
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#e91e8c', '#f4a849', '#f9a8d4', '#7c3aed', '#ffd166'],
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#e91e8c', '#f4a849', '#f9a8d4', '#7c3aed', '#ffd166'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

export default function FinalProposal() {
  const [step, setStep] = useState<Step>('idle')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const handleBoxClick = useCallback(() => {
    if (step !== 'idle') return
    setStep('ribbon-loose')
    setTimeout(() => setStep('ribbon-away'), 800)
    setTimeout(() => setStep('shaking'), 1400)
    setTimeout(() => setStep('opening'), 2000)
    setTimeout(() => setStep('message'), 2800)
  }, [step])

  const handleYes = () => {
    setStep('celebration')
    fireworks()
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { x: 0.5, y: 0.3 },
      colors: ['#e91e8c', '#f4a849', '#f9a8d4', '#7c3aed', '#ffd166', '#fff'],
    })
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: i * 0.8, duration: 0.9 },
    }),
  }

  return (
    <section
      id="final-proposal"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #150515 0%, #0a0a0f 60%, #0a0a0f 100%)',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '80vw', height: '80vw', maxWidth: '800px', maxHeight: '800px',
          left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-serif text-blush text-sm tracking-widest uppercase mb-8 text-center"
        style={{ letterSpacing: '0.3em' }}
      >
        The Final Surprise
      </motion.p>

      <AnimatePresence mode="wait">
        {step !== 'celebration' ? (
          <motion.div
            key="gift-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Instruction */}
            {step === 'idle' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif text-gold text-xl md:text-2xl mb-8 text-center"
                style={{ fontStyle: 'italic' }}
              >
                {config.finalProposal.instruction}
              </motion.p>
            )}

            {/* Big gift box */}
            <motion.div
              className="relative cursor-pointer"
              style={{ width: '220px', height: '250px' }}
              onClick={handleBoxClick}
              animate={
                step === 'shaking'
                  ? { x: [-8, 8, -8, 8, -5, 5, 0], rotate: [-3, 3, -3, 3, 0] }
                  : step === 'idle'
                  ? { y: [0, -8, 0] }
                  : {}
              }
              transition={
                step === 'idle'
                  ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.5 }
              }
              whileHover={step === 'idle' ? { scale: 1.05, boxShadow: '0 0 40px rgba(233,30,140,0.4)' } : {}}
              aria-label="Final gift box — click to open"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleBoxClick()}
            >
              <svg viewBox="0 0 220 250" width="220" height="250"
                style={{ filter: 'drop-shadow(0 0 25px rgba(233,30,140,0.5))' }}
              >
                <defs>
                  <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a0812" />
                    <stop offset="100%" stopColor="#0f0408" />
                  </linearGradient>
                  <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#220b18" />
                    <stop offset="100%" stopColor="#160510" />
                  </linearGradient>
                  <filter id="finalGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Box body */}
                <rect x="10" y="120" width="200" height="120" rx="8" fill="url(#boxGrad)" />
                <rect x="10" y="120" width="200" height="120" rx="8" fill="none" stroke="#e91e8c" strokeWidth="1.5" opacity="0.7" />
                {/* Gold accents */}
                <rect x="10" y="120" width="200" height="3" rx="2" fill="#f4a849" opacity="0.5" />
                <rect x="10" y="237" width="200" height="3" rx="2" fill="#f4a849" opacity="0.5" />

                {/* Vertical ribbon */}
                <rect x="100" y="120" width="20" height="120" fill="#e91e8c" opacity="0.9" filter="url(#finalGlow)" />

                {/* Horizontal ribbon on body */}
                <rect x="10" y="178" width="200" height="12" fill="#e91e8c" opacity="0.7" />

                {/* Lid */}
                <motion.g
                  animate={step === 'opening' || step === 'message' ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.34, 1.2, 0.64, 1] }}
                >
                  <rect x="4" y="96" width="212" height="34" rx="8" fill="url(#lidGrad)" />
                  <rect x="4" y="96" width="212" height="34" rx="8" fill="none" stroke="#e91e8c" strokeWidth="1.5" opacity="0.9" />
                  <rect x="4" y="108" width="212" height="10" fill="#e91e8c" opacity="0.85" filter="url(#finalGlow)" />
                </motion.g>

                {/* Ribbon loosening */}
                <motion.g
                  animate={
                    step === 'ribbon-loose'
                      ? { rotate: 15, x: 10 }
                      : step === 'ribbon-away' || step === 'shaking' || step === 'opening' || step === 'message'
                      ? { rotate: 45, x: 120, y: -60, opacity: 0 }
                      : {}
                  }
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ transformOrigin: '110px 75px' }}
                >
                  {/* Left bow */}
                  <ellipse cx="82" cy="75" rx="30" ry="18" fill="#e91e8c" transform="rotate(-25 82 75)" filter="url(#finalGlow)" />
                  <ellipse cx="82" cy="75" rx="18" ry="10" fill="#150510" opacity="0.5" transform="rotate(-25 82 75)" />
                </motion.g>
                <motion.g
                  animate={
                    step === 'ribbon-loose'
                      ? { rotate: -15, x: -10 }
                      : step === 'ribbon-away' || step === 'shaking' || step === 'opening' || step === 'message'
                      ? { rotate: -45, x: -120, y: -60, opacity: 0 }
                      : {}
                  }
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ transformOrigin: '110px 75px' }}
                >
                  {/* Right bow */}
                  <ellipse cx="138" cy="75" rx="30" ry="18" fill="#e91e8c" transform="rotate(25 138 75)" filter="url(#finalGlow)" />
                  <ellipse cx="138" cy="75" rx="18" ry="10" fill="#150510" opacity="0.5" transform="rotate(25 138 75)" />
                </motion.g>

                {/* Center knot */}
                <motion.g
                  animate={
                    step === 'ribbon-away' || step === 'shaking' || step === 'opening' || step === 'message'
                      ? { opacity: 0 }
                      : { opacity: 1 }
                  }
                >
                  <circle cx="110" cy="78" r="13" fill="#e91e8c" filter="url(#finalGlow)" />
                  <circle cx="110" cy="78" r="6" fill="rgba(255,255,255,0.25)" />
                </motion.g>

                {/* Light burst when opening */}
                <AnimatePresence>
                  {(step === 'opening' || step === 'message') && (
                    <motion.g key="burst">
                      <motion.circle
                        cx="110" cy="130" r="5"
                        fill="#fff"
                        initial={{ r: 5, opacity: 1 }}
                        animate={{ r: 90, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      />
                      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
                        <motion.line
                          key={i}
                          x1="110" y1="120"
                          x2={110 + Math.cos((a * Math.PI) / 180) * 90}
                          y2={120 + Math.sin((a * Math.PI) / 180) * 90}
                          stroke="#f4a849"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ delay: i * 0.04, duration: 0.7 }}
                        />
                      ))}
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>

              {/* Floating hearts from box */}
              <AnimatePresence>
                {step === 'message' && (
                  <>
                    {['❤️', '💕', '✨', '🌸', '💫', '❤️'].map((e, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-2xl pointer-events-none select-none"
                        style={{ left: `${10 + i * 16}%`, top: '30%' }}
                        initial={{ y: 0, opacity: 1, scale: 0.5 }}
                        animate={{ y: -200 - i * 30, opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 + i * 0.2, delay: i * 0.1 }}
                      >
                        {e}
                      </motion.span>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Final message */}
            <AnimatePresence>
              {step === 'message' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-10 text-center max-w-2xl mx-auto"
                >
                  {config.finalProposal.lines.map((line, i) => (
                    <motion.p
                      key={i}
                      custom={i}
                      variants={lineVariants}
                      initial="hidden"
                      animate="visible"
                      className={`font-serif ${i === 0 ? 'gradient-text-rose' : 'text-cream'} mb-3`}
                      style={{
                        fontSize: i === 0
                          ? 'clamp(1.5rem, 4vw, 2.5rem)'
                          : i === 4
                          ? 'clamp(1.3rem, 3.5vw, 2rem)'
                          : 'clamp(1.1rem, 3vw, 1.6rem)',
                        fontStyle: 'italic',
                        fontWeight: i === 3 ? 600 : 300,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}

                  {/* THE QUESTION */}
                  <motion.p
                    custom={config.finalProposal.lines.length + 1}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    className="font-serif gradient-text-gold mt-8 mb-10"
                    style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 600, fontStyle: 'italic' }}
                  >
                    {config.finalProposal.question}
                  </motion.p>

                  {/* YES Buttons */}
                  <motion.div
                    custom={config.finalProposal.lines.length + 2}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    {config.finalProposal.buttons.map((label, i) => (
                      <motion.button
                        key={i}
                        onClick={handleYes}
                        className="px-10 py-4 rounded-full font-serif text-xl font-medium"
                        style={{
                          background: i === 0
                            ? 'linear-gradient(135deg, #e91e8c, #c2185b)'
                            : 'linear-gradient(135deg, #f4a849, #e65100)',
                          color: '#fff',
                          boxShadow: i === 0
                            ? '0 0 30px rgba(233,30,140,0.5)'
                            : '0 0 30px rgba(244,168,73,0.5)',
                          fontStyle: 'italic',
                        }}
                        whileHover={{ scale: 1.08, y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        aria-label={label}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </motion.div>

                  <motion.p
                    custom={config.finalProposal.lines.length + 4}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    className="font-serif text-blush mt-6 text-sm"
                    style={{ fontStyle: 'italic' }}
                  >
                    {config.finalProposal.from}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── CELEBRATION SCREEN ── */
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.h2
              className="font-serif gradient-text-rose mb-10"
              style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.6rem)', fontWeight: 500, fontStyle: 'italic' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {config.finalProposal.celebration}
            </motion.h2>

            {/* ── The final reveal: her photo, held close ── */}
            <motion.div
              className="relative mx-auto mb-10"
              style={{ width: 'min(260px, 68vw)' }}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* soft aura behind the heart */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  inset: '-18%',
                  background:
                    'radial-gradient(circle, rgba(244,168,73,0.35) 0%, rgba(233,30,140,0.18) 38%, transparent 72%)',
                  filter: 'blur(26px)',
                }}
                animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.06, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* heart-shaped glow echo directly behind the photo */}
              <div
                className="heart-clip absolute inset-0 pointer-events-none"
                style={{ background: 'rgba(244,168,73,0.55)', transform: 'scale(1.05)', filter: 'blur(8px)' }}
              />
              <motion.div
                className="heart-clip relative overflow-hidden"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={finalImg}
                  alt="Bangaram"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(1.05) contrast(1.03)' }}
                />
              </motion.div>
            </motion.div>

            {/* "20" — quiet, cinematic */}
            <motion.p
              className="font-serif gradient-text-gold leading-none"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)', fontWeight: 600 }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.9, ease: [0.34, 1.4, 0.64, 1] }}
            >
              20
            </motion.p>

            <motion.p
              className="font-serif text-cream mt-2"
              style={{ fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', fontWeight: 300, fontStyle: 'italic' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.8 }}
            >
              Happy Birthday
            </motion.p>

            <motion.p
              className="font-serif gradient-text-rose mt-1 mb-10"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 600, fontStyle: 'italic' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.9 }}
            >
              Bangaram
            </motion.p>

            <motion.div
              className="flex justify-center gap-3 text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
            >
              {['❤️', '💕', '✨', '💫', '🌸', '💕', '❤️'].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -20, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                >
                  {e}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              className="font-serif text-blush mt-8 text-sm"
              style={{ fontStyle: 'italic', opacity: 0.75 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 3.6 }}
            >
              — Harshaa, always yours
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
