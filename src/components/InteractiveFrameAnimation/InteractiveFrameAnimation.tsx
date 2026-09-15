import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  totalFrames?: number
  framePrefix?: string
  frameSuffix?: string
  className?: string
  style?: React.CSSProperties
  fallbackImg?: string
}

const FRAME_SENSITIVITY = 0.04
const SMOOTHING = 0.08
const PARALLAX_AMOUNT = 10 // pixels

export default function InteractiveFrameAnimation({
  totalFrames = 60,
  framePrefix = '/frames/frame_',
  frameSuffix = '.gif',
  className = '',
  style,
  fallbackImg
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(false)

  // Physics state
  const frameIndex = useRef(0)
  const renderIndex = useRef(0)
  const lastX = useRef<number | null>(null)
  
  // Parallax state (-1 to 1)
  const pointerX = useRef(0)
  const pointerY = useRef(0)
  const currentParallaxX = useRef(0)
  const currentParallaxY = useRef(0)

  const reqRef = useRef<number>(0)

  // Preload frames
  useEffect(() => {
    let loadedCount = 0
    let isMounted = true

    const handleLoad = () => {
      loadedCount++
      if (loadedCount >= totalFrames && isMounted) {
        setLoaded(true)
      }
    }

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image()
      const num = i.toString().padStart(2, '0')
      img.src = `${framePrefix}${num}${frameSuffix}`
      
      if (img.complete) {
        handleLoad()
      } else {
        img.onload = handleLoad
        img.onerror = handleLoad // Avoid getting stuck if one frame fails
      }
      
      imagesRef.current[i] = img
    }

    return () => {
      isMounted = false
    }
  }, [totalFrames, framePrefix, frameSuffix])

  // Canvas size management
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    // Use devicePixelRatio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
  }, [])

  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  // Render loop
  useEffect(() => {
    const drawFrame = (index: number) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      
      const img = imagesRef.current[index]
      if (!img || !img.complete || img.naturalWidth === 0) return
      
      const canvasAspect = canvas.width / canvas.height
      const imgAspect = img.naturalWidth / img.naturalHeight
      
      let drawW = canvas.width
      let drawH = canvas.height
      
      // object-fit: cover equivalent
      if (canvasAspect > imgAspect) {
        drawH = canvas.width / imgAspect
      } else {
        drawW = canvas.height * imgAspect
      }
      
      const drawX = (canvas.width - drawW) / 2
      const drawY = (canvas.height - drawH) / 2
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    const tick = () => {
      // 1. Frame interpolation
      renderIndex.current += (frameIndex.current - renderIndex.current) * SMOOTHING
      const currentIntFrame = Math.round(renderIndex.current)
      
      // Ensure we stay within bounds
      const safeFrame = Math.max(0, Math.min(totalFrames - 1, currentIntFrame))
      drawFrame(safeFrame)

      // 2. Parallax interpolation
      const canvas = canvasRef.current
      if (canvas) {
        currentParallaxX.current += (pointerX.current - currentParallaxX.current) * (SMOOTHING * 0.5)
        currentParallaxY.current += (pointerY.current - currentParallaxY.current) * (SMOOTHING * 0.5)
        
        // Apply very subtle parallax transform
        const tx = currentParallaxX.current * PARALLAX_AMOUNT
        const ty = currentParallaxY.current * PARALLAX_AMOUNT
        canvas.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`
      }

      reqRef.current = requestAnimationFrame(tick)
    }

    reqRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(reqRef.current)
  }, [totalFrames])

  // Input Handlers & Auto-play loop
  useEffect(() => {
    let lastScrollY = window.scrollY
    let autoPlayFrame = 0
    let autoPlayTimer: any = null

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = window.innerHeight * 0.8
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll))
      
      frameIndex.current = progress * (totalFrames - 1)
      lastScrollY = scrollY
    }

    // Auto-advance frames continuously so the GIF plays automatically without cursor/scroll requirement
    const interval = setInterval(() => {
      if (window.scrollY < 10) {
        autoPlayFrame = (autoPlayFrame + 1) % totalFrames
        frameIndex.current = autoPlayFrame
      }
    }, 50) // ~20fps animation loop
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate parallax (-1 to 1 based on screen position)
      const cw = window.innerWidth
      const ch = window.innerHeight
      pointerX.current = (e.clientX / cw - 0.5) * 2
      pointerY.current = (e.clientY / ch - 0.5) * 2
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [totalFrames])

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`} 
      style={style}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full origin-center" 
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Loading state / Fallback */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none bg-black flex items-center justify-center ${loaded ? 'opacity-0' : 'opacity-100'}`}
      >
        {fallbackImg && (
          <img 
            src={fallbackImg} 
            alt="Proposal loading..." 
            className="w-full h-full object-cover" 
            style={{ filter: 'brightness(0.72) saturate(1.2)' }}
          />
        )}
      </div>
    </div>
  )
}
