import { useEffect, useRef, useState, useCallback } from 'react'

export function useMusicPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.4
    audio.muted = true
    audioRef.current = audio

    // Attempt autoplay immediately
    const startAudio = () => {
      audio.muted = false
      setMuted(false)
      audio.play().then(() => {
        setPlaying(true)
        sessionStorage.setItem('musicPlaying', 'true')
      }).catch(() => {
        // Autoplay blocked by browser policy, wait for any user interaction (click, touch, scroll, mousemove)
        const handleFirstInteraction = () => {
          audio.muted = false
          setMuted(false)
          audio.play().then(() => {
            setPlaying(true)
            sessionStorage.setItem('musicPlaying', 'true')
          }).catch(() => {})
          window.removeEventListener('click', handleFirstInteraction)
          window.removeEventListener('touchstart', handleFirstInteraction)
          window.removeEventListener('scroll', handleFirstInteraction)
          window.removeEventListener('mousemove', handleFirstInteraction)
        }
        window.addEventListener('click', handleFirstInteraction)
        window.addEventListener('touchstart', handleFirstInteraction)
        window.addEventListener('scroll', handleFirstInteraction)
        window.addEventListener('mousemove', handleFirstInteraction)
      })
    }

    startAudio()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [src])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      sessionStorage.setItem('musicPlaying', 'false')
    } else {
      audio.muted = false
      setMuted(false)
      audio.play().catch(() => {})
      setPlaying(true)
      sessionStorage.setItem('musicPlaying', 'true')
    }
  }, [playing])

  return { playing, muted, toggle }
}
