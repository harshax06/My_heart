import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import memory1 from '../../assets/images/memory-1.webp'
import memory2 from '../../assets/images/memory-2.webp'
import memory3 from '../../assets/images/memory-3.webp'
import memory4 from '../../assets/images/memory-4.webp'
import memory5 from '../../assets/images/memory-5.webp'
import memory6 from '../../assets/images/memory-6.webp'

const MEMORIES = [
  { src: memory1, caption: 'This look. This exact one.', rotate: -4 },
  { src: memory2, caption: 'Even mid-thought, you\u2019re beautiful.', rotate: 3 },
  { src: memory3, caption: 'Every step, more sure of you.', rotate: -2 },
  { src: memory5, caption: 'Somewhere between the sky and the sea.', rotate: 4 },
  { src: memory4, caption: 'Sunlit and unbothered, just like you.', rotate: -3 },
  { src: memory6, caption: 'Silly and soft, my favourite kind of you.', rotate: 2 },
]

function PolaroidCard({
  item,
  index,
  inView,
  onOpen,
}: {
  item: (typeof MEMORIES)[number]
  index: number
  inView: boolean
  onOpen: (i: number) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -10, y: px * 12 })
  }, [])

  const handleLeave = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotate: item.rotate }}
      animate={inView ? { opacity: 1, y: 0, rotate: item.rotate } : {}}
      transition={{ delay: 0.25 + index * 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onOpen(index)}
      className="relative cursor-pointer select-none polaroid-frame"
      style={{
        width: 'min(280px, 78vw)',
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      role="button"
      tabIndex={0}
      aria-label={`Memory photo ${index + 1}. Click to view larger.`}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(index)}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className="rounded-[6px] overflow-hidden relative"
        style={{
          background: 'linear-gradient(160deg, #fffaf2 0%, #f8ede0 100%)',
          padding: '14px 14px 46px 14px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(244,168,73,0.15)',
        }}
      >
        <div className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '4/5' }}>
          <img
            src={item.src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(1.05) contrast(1.02)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.25)' }}
          />
          {/* golden sheen sweep */}
          <div className="polaroid-sheen absolute inset-0 pointer-events-none" />
        </div>
        <p
          className="font-hand text-center absolute bottom-2 left-0 right-0"
          style={{ color: '#3a2a1a', fontSize: '1.15rem' }}
        >
          {item.caption}
        </p>
      </motion.div>

      {/* small pin/glow */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, #ffe9b3 0%, #f4a849 70%)',
          boxShadow: '0 0 10px rgba(244,168,73,0.8)',
        }}
      />
    </motion.div>
  )
}

export default function PhotoMemories() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="photo-memories"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #120c16 45%, #0a0a0f 100%)',
      }}
    >
      {/* ambient grain + glow */}
      <div className="grain-overlay absolute inset-0 pointer-events-none" />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '60vw', height: '60vw', maxWidth: '600px', maxHeight: '600px',
          left: '50%', top: '10%', transform: 'translate(-50%,0)',
          background: 'radial-gradient(circle, rgba(244,168,73,0.07) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-blush text-sm tracking-widest uppercase text-center mb-4"
          style={{ letterSpacing: '0.3em' }}
        >
          Held close
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif gradient-text-gold text-center mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 500, fontStyle: 'italic' }}
        >
          Moments I keep
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
          style={{ color: 'rgba(250,247,245,0.4)', fontSize: '0.9rem' }}
        >
          Tap a photo to look closer
        </motion.p>

        <div
          className="flex flex-wrap items-center justify-center gap-10 md:gap-14"
          style={{ perspective: '1200px' }}
        >
          {MEMORIES.map((item, i) => (
            <PolaroidCard key={i} item={item} index={i} inView={inView} onOpen={setOpenIndex} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            style={{ background: 'rgba(5,3,7,0.92)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-lg overflow-hidden"
              style={{
                maxWidth: 'min(480px, 90vw)',
                boxShadow: '0 0 60px rgba(244,168,73,0.25), 0 30px 80px rgba(0,0,0,0.6)',
                border: '1px solid rgba(244,168,73,0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={MEMORIES[openIndex].src} alt="" className="w-full h-full object-cover" />
              <div
                className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
              >
                <p className="font-hand text-cream" style={{ fontSize: '1.4rem' }}>
                  {MEMORIES[openIndex].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }}
      />
    </section>
  )
}
