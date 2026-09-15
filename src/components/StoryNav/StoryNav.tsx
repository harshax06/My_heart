import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'hero',            label: 'Our Story' },
  { id: 'birthday',        label: 'Birthday' },
  { id: 'love-message',    label: 'Love' },
  { id: 'quotes',          label: 'Quotes' },
  { id: 'particle-heart',  label: 'Her Heart' },
  { id: 'love-cards',      label: 'About You' },
  { id: 'photo-memories',  label: 'Photos' },
  { id: 'memory-wall',     label: 'Memories' },
  { id: 'gift-boxes',      label: 'Surprises' },
  { id: 'confession',      label: 'One Last Thing' },
  { id: 'final-proposal',  label: 'The Proposal' },
]

export default function StoryNav() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Menu items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-0 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,10,15,0.92)',
              border: '1px solid rgba(233,30,140,0.25)',
              backdropFilter: 'blur(16px)',
              minWidth: '180px',
            }}
          >
            {sections.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="w-full text-left px-5 py-3 font-serif text-sm transition-colors"
                style={{ color: 'rgba(250,247,245,0.8)', borderBottom: i < sections.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ backgroundColor: 'rgba(233,30,140,0.12)', color: '#f9a8d4', paddingLeft: '24px' }}
              >
                <span className="mr-2 text-rose" style={{ fontSize: '10px' }}>❤</span>
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(10,10,15,0.85)',
          border: '1px solid rgba(233,30,140,0.4)',
          backdropFilter: 'blur(12px)',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(233,30,140,0.5)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Story navigation menu"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5 }}
      >
        <motion.span
          animate={{ scale: open ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: '18px' }}
        >
          {open ? '✕' : '❤️'}
        </motion.span>
      </motion.button>
    </div>
  )
}
