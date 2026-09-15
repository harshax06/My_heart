import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import { config } from '../../data/config'
import gift1 from '../../assets/images/gift-1.webp'
import gift2 from '../../assets/images/gift-2.webp'

const GIFT_IMAGES: Record<string, string> = {
  memory2: gift1,
  memory6: gift2,
}

type GiftState = 'idle' | 'shaking' | 'opening' | 'revealed'

function GiftBox({ gift, index }: { gift: typeof config.gifts[0]; index: number }) {
  const [state, setState] = useState<GiftState>('idle')

  const colors = [
    { ribbon: '#e91e8c', lid: '#1a0a15', box: '#12070f' },
    { ribbon: '#f4a849', lid: '#1a1205', box: '#120d04' },
    { ribbon: '#7c3aed', lid: '#100a1f', box: '#0a071a' },
  ]
  const c = colors[index % colors.length]

  const open = () => {
    if (state !== 'idle') return
    setState('shaking')
    setTimeout(() => setState('opening'), 600)
    setTimeout(() => {
      setState('revealed')
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.2 + index * 0.3, y: 0.5 },
        colors: ['#e91e8c', '#f4a849', '#f9a8d4', '#7c3aed', '#ffd166'],
        ticks: 150,
      })
    }, 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <motion.div
        className="relative cursor-pointer"
        style={{ width: '160px', height: '180px' }}
        onClick={open}
        animate={
          state === 'shaking'
            ? { x: [-5, 5, -5, 5, -3, 3, 0], rotate: [-2, 2, -2, 2, 0] }
            : {}
        }
        transition={{ duration: 0.5 }}
        whileHover={state === 'idle' ? { scale: 1.05, y: -5 } : {}}
        aria-label={`Gift box: ${gift.label}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && open()}
      >
        {/* SVG Gift Box */}
        <svg viewBox="0 0 160 180" width="160" height="180" style={{ filter: `drop-shadow(0 0 15px ${c.ribbon}55)` }}>
          {/* Box body */}
          <rect x="10" y="90" width="140" height="80" rx="6" fill={c.box} />
          <rect x="10" y="90" width="140" height="80" rx="6" fill="none" stroke={c.ribbon} strokeWidth="1.5" opacity="0.6" />

          {/* Vertical ribbon */}
          <rect x="72" y="90" width="16" height="80" fill={c.ribbon} opacity="0.85" />

          {/* Lid */}
          <motion.g
            animate={state === 'opening' || state === 'revealed' ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <rect x="4" y="72" width="152" height="28" rx="6" fill={c.lid} />
            <rect x="4" y="72" width="152" height="28" rx="6" fill="none" stroke={c.ribbon} strokeWidth="1.5" opacity="0.8" />
            {/* Horizontal ribbon on lid */}
            <rect x="4" y="82" width="152" height="8" fill={c.ribbon} opacity="0.85" />
          </motion.g>

          {/* Bow */}
          <motion.g
            animate={state === 'opening' || state === 'revealed' ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Left bow loop */}
            <ellipse cx="62" cy="65" rx="22" ry="14" fill={c.ribbon} transform="rotate(-20, 62, 65)" />
            <ellipse cx="62" cy="65" rx="14" ry="8" fill={c.lid} transform="rotate(-20, 62, 65)" opacity="0.5" />
            {/* Right bow loop */}
            <ellipse cx="98" cy="65" rx="22" ry="14" fill={c.ribbon} transform="rotate(20, 98, 65)" />
            <ellipse cx="98" cy="65" rx="14" ry="8" fill={c.lid} transform="rotate(20, 98, 65)" opacity="0.5" />
            {/* Center knot */}
            <circle cx="80" cy="68" r="10" fill={c.ribbon} />
            <circle cx="80" cy="68" r="5" fill="rgba(255,255,255,0.2)" />
          </motion.g>

          {/* Light burst when open */}
          <AnimatePresence>
            {(state === 'opening' || state === 'revealed') && (
              <motion.g key="burst">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <motion.line
                    key={i}
                    x1="80" y1="90"
                    x2={80 + Math.cos((angle * Math.PI) / 180) * 60}
                    y2={90 + Math.sin((angle * Math.PI) / 180) * 60}
                    stroke={c.ribbon}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.6 }}
                  />
                ))}
                {/* Glow circle */}
                <motion.circle
                  cx="80" cy="90" r="30"
                  fill={c.ribbon}
                  initial={{ opacity: 0, r: 0 }}
                  animate={{ opacity: [0, 0.4, 0], r: 55 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Floating hearts on open */}
        <AnimatePresence>
          {state === 'revealed' && (
            <>
              {['❤️', '💕', '✨', '🌸'].map((e, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xl pointer-events-none"
                  style={{ left: `${20 + i * 20}%`, top: '50%' }}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -120 - i * 20, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, delay: i * 0.15 }}
                >
                  {e}
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <p
        className="font-sans text-cream text-sm mt-3 text-center"
        style={{ letterSpacing: '0.05em', opacity: state === 'revealed' ? 0 : 0.7 }}
      >
        {gift.label}
      </p>

      {/* Message */}
      <AnimatePresence>
        {state === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 rounded-2xl p-5 text-center max-w-xs glass"
            style={{ border: `1px solid ${c.ribbon}55` }}
          >
            {gift.image && GIFT_IMAGES[gift.image] && (
              <motion.div
                className="heart-clip overflow-hidden mx-auto mb-4"
                style={{ width: '110px' }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={GIFT_IMAGES[gift.image]}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <p
              className="font-serif text-cream"
              style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6 }}
            >
              {gift.message}
            </p>
            {gift.from && (
              <p className="text-sm mt-2" style={{ color: 'rgba(249,168,212,0.7)' }}>
                {gift.from}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function GiftBoxes() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="gift-boxes"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0e0814 50%, #0a0a0f 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-blush text-sm tracking-widest uppercase text-center mb-4"
          style={{ letterSpacing: '0.3em' }}
        >
          Three small things
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif gradient-text-rose text-center mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 500, fontStyle: 'italic' }}
        >
          I wrapped these for you
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
          style={{ color: 'rgba(250,247,245,0.4)', fontSize: '0.9rem' }}
        >
          Tap each one to open it 🎁
        </motion.p>

        <div className="flex flex-col md:flex-row items-start justify-center gap-16 md:gap-12">
          {config.gifts.map((gift, i) => (
            <GiftBox key={i} gift={gift} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
