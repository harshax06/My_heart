/**
 * MusicControl.tsx
 *
 * Floating music control button. Uses audioManager as the single source of
 * truth — does NOT create its own HTMLAudioElement.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribe, togglePlay, toggleMute, type AudioState } from '../../utils/audioManager'

export default function MusicControl() {
  const [audioState, setAudioState] = useState<AudioState>({
    playing: false,
    muted: false,
    trackName: null,
    waitingForInteraction: false,
  })

  useEffect(() => {
    // Subscribe to audioManager state — unsubscribes on unmount
    const unsub = subscribe(setAudioState)
    return unsub
  }, [])

  const handleClick = () => {
    togglePlay()
  }

  const isPlaying = audioState.playing && !audioState.muted
  const isWaiting = audioState.waitingForInteraction

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass flex items-center justify-center"
      style={{ border: '1px solid rgba(233,30,140,0.4)' }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(233,30,140,0.5)' }}
      whileTap={{ scale: 0.95 }}
      aria-label={
        isWaiting
          ? 'Tap to start music'
          : isPlaying
          ? 'Pause music'
          : 'Play music'
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <AnimatePresence mode="wait">
        {isWaiting ? (
          // Pulsing icon to indicate "waiting for interaction"
          <motion.div
            key="waiting"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: 'rgba(233,30,140,0.6)', fontSize: '20px' }}
          >
            ♪
          </motion.div>
        ) : isPlaying ? (
          <motion.div
            key="playing"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-end gap-[3px] h-5"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ background: '#e91e8c' }}
                animate={{ height: ['8px', '20px', '12px', '18px', '8px'] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.svg
            key="paused"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            viewBox="0 0 24 24" fill="#f9a8d4" width="22" height="22"
          >
            <path d="M9 4l10 8-10 8V4z"/>
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
