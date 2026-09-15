import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { config } from '../../data/config'
import gardenImg from '../../assets/images/garden.webp'
import chokerImg from '../../assets/images/choker.webp'
import wavesImg from '../../assets/images/waves.webp'
import coupleImg from '../../assets/images/couple.webp'

const IMAGES: Record<string, string> = {
  garden: gardenImg,
  choker: chokerImg,
  waves: wavesImg,
  couple: coupleImg,
}

function NoteCard({ note, index }: { note: typeof config.memoryWall[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const image = note.image ? IMAGES[note.image] : undefined

  const rotations = [-3, 2, -1, 3, -2, 1]
  const rot = rotations[index % rotations.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rot }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.06, zIndex: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
      className="relative cursor-pointer select-none"
      style={{ height: '260px', perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
      tabIndex={0}
      role="button"
      aria-label={`Memory card: ${note.front}. Click to flip.`}
    >
      <div className={`card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div
          className="card-face rounded-2xl p-5 flex flex-col items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #fefbe8 0%, #fff9f0 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {image ? (
            <>
              <div className="heart-clip overflow-hidden" style={{ width: '104px' }}>
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
              <p
                className="font-hand text-center"
                style={{ color: '#3a2020', fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', fontWeight: 500, lineHeight: 1.3 }}
              >
                {note.front}
              </p>
            </>
          ) : (
            <>
              {/* Pinhole */}
              <div
                className="w-3 h-3 rounded-full mb-1"
                style={{ background: 'rgba(233,30,140,0.7)', boxShadow: '0 0 6px rgba(233,30,140,0.5)' }}
              />
              <p
                className="font-hand text-center"
                style={{ color: '#3a2020', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 500, lineHeight: 1.4 }}
              >
                {note.front}
              </p>
            </>
          )}
          <p className="text-xs text-center mt-auto" style={{ color: 'rgba(0,0,0,0.3)' }}>
            tap to read more ❤️
          </p>
        </div>

        {/* Back */}
        <div
          className="card-back rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(233,30,140,0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-2xl mb-3">❤️</span>
          <p
            className="font-serif text-cream text-center"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontStyle: 'italic', lineHeight: 1.5 }}
          >
            {note.back}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function MemoryWall() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="memory-wall"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0a14 50%, #0a0a0f 100%)',
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
          Things I want you to know
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif gradient-text-gold text-center mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 500, fontStyle: 'italic' }}
        >
          About you, Bangaram
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
          style={{ color: 'rgba(250,247,245,0.4)', fontSize: '0.9rem' }}
        >
          Click each card to reveal a hidden message 💌
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {config.memoryWall.map((note, i) => (
            <NoteCard key={i} note={note} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
