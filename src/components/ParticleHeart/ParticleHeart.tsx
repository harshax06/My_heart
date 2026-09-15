import { useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { config } from '../../data/config'
import { useDeviceCapability } from '../../hooks/useDeviceCapability'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import girlfriendImg from '../../assets/images/heart-portrait.webp'

// ─── Types ────────────────────────────────────────────────
interface Particle {
  x: number; y: number
  tx: number; ty: number
  sx: number; sy: number
  color: string
  size: number
  vx: number; vy: number
}

interface Arrow {
  x: number; y: number
  vx: number; vy: number
  len: number; active: boolean
}

// ─── Heart Path Helper ────────────────────────────────────
function createHeartPath(S: number): Path2D {
  const path = new Path2D()
  const scale = S * 0.026
  const hcx = S / 2
  const hcy = S / 2 - (S * 0.05)
  for (let t = 0; t <= Math.PI * 2; t += 0.02) {
    const x = hcx + 16 * Math.pow(Math.sin(t), 3) * scale
    const y = hcy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale
    if (t === 0) path.moveTo(x, y)
    else path.lineTo(x, y)
  }
  path.closePath()
  return path
}

// ─── Prepare Full Heart with Photo ────────────────────────
function prepareFullHeart(
  img: HTMLImageElement,
  size: number
): HTMLCanvasElement {
  const offscreen = document.createElement('canvas')
  const S = Math.floor(size)
  offscreen.width = S
  offscreen.height = S
  const ctx = offscreen.getContext('2d', { willReadFrequently: true })!
  
  const path = createHeartPath(S)
  
  ctx.save()
  ctx.clip(path)
  
  // Draw the photo to COVER the entire heart (object-fit: cover strategy)
  const imgAspect = img.width / img.height
  
  let drawW: number, drawH: number
  
  // Use cover strategy: scale image to fill the entire heart bounds
  if (imgAspect > 1) {
    // Landscape image
    drawH = S
    drawW = S * imgAspect
  } else {
    // Portrait or square image
    drawW = S
    drawH = S / imgAspect
  }
  
  const drawX = (S - drawW) / 2
  const drawY = (S - drawH) / 2 - (S * 0.03)
  
  ctx.drawImage(img, drawX, drawY, drawW, drawH)
  ctx.restore()
  
  return offscreen
}

// ─── Main Component ───────────────────────────────────────
export default function ParticleHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const { isMobile } = useDeviceCapability()
  const prefersReduced = useReducedMotion()
  const animRef = useRef<number>(0)
  const cleanupRef = useRef<(() => void) | null>(null)

  const runAnimation = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    if (prefersReduced) {
      const ctx = canvas.getContext('2d')!
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.fillStyle = '#e91e8c'
      ctx.font = `${Math.min(W, H) * 0.4}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('❤️', W / 2, H / 2)
      return
    }

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    const cx = W / 2
    const cy = H / 2
    const imgSize = Math.floor(Math.min(W, H) * 0.9)

    const ctx = canvas.getContext('2d')!

    // Prepare offscreen canvas with photo filling the full heart
    const offscreen = prepareFullHeart(img, imgSize)
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true })!
    const imageData = offCtx.getImageData(0, 0, imgSize, imgSize).data

    // Dense pixel step for a crisp, full heart image
    const step = isMobile ? 3 : 2
    
    const particles: Particle[] = []
    const offsetX = cx - imgSize / 2
    const offsetY = cy - imgSize / 2

    // Create particles from every visible pixel in the heart
    for (let py = 0; py < imgSize; py += step) {
      for (let px = 0; px < imgSize; px += step) {
        const idx = (py * imgSize + px) * 4
        const a = imageData[idx + 3]
        if (a < 50) continue
        
        const r = imageData[idx]
        const g = imageData[idx + 1]
        const b = imageData[idx + 2]

        const tx = offsetX + px
        const ty = offsetY + py

        particles.push({
          x: cx + (Math.random() - 0.5) * W * 1.5,
          y: cy + (Math.random() - 0.5) * H * 1.5,
          tx, ty,
          sx: px, sy: py,
          color: `rgb(${r},${g},${b})`,
          size: step,
          vx: 0, vy: 0,
        })
      }
    }

    let phase: 'form' | 'idle' | 'arrows' | 'rebuild' = 'form'
    let phaseProgress = 0
    let arrowsDone = false
    const arrows: Arrow[] = []
    let loopTimer1: ReturnType<typeof setTimeout>
    let loopTimer2: ReturnType<typeof setTimeout>
    let loopTimer3: ReturnType<typeof setTimeout>
    let running = true

    function spawnArrows() {
      arrows.length = 0
      const count = 3
      for (let i = 0; i < count; i++) {
        arrows.push({
          x: -100 - (i * 200),
          y: H * (0.25 + i * 0.22),
          vx: W * 0.015 + Math.random() * W * 0.003,
          vy: (Math.random() - 0.5) * 1,
          len: 120,
          active: true,
        })
      }
    }

    function drawArrow(ctx: CanvasRenderingContext2D, a: Arrow) {
      const angle = Math.atan2(a.vy, a.vx)
      ctx.save()
      ctx.translate(a.x, a.y)
      ctx.rotate(angle)
      ctx.shadowColor = '#ffd166'
      ctx.shadowBlur = 20

      const grad = ctx.createLinearGradient(-a.len, 0, 15, 0)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, 'rgba(255,209,102,0.8)')
      grad.addColorStop(1, '#ffffff')
      ctx.strokeStyle = grad
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(-a.len, 0)
      ctx.lineTo(15, 0)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(20, 0)
      ctx.lineTo(4, -8)
      ctx.lineTo(4, 8)
      ctx.closePath()
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.restore()
    }

    function tick() {
      if (!running) return
      ctx.clearRect(0, 0, W, H)
      phaseProgress++
      
      // Use fillRect for dense particles (faster than arc for step=2)
      for (const p of particles) {
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        p.vx = (p.vx + dx * 0.07) * 0.82
        p.vy = (p.vy + dy * 0.07) * 0.82
        p.x += p.vx
        p.y += p.vy

        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      // Arrows phase
      if (phase === 'arrows') {
        let allGone = true
        for (const arrow of arrows) {
          if (!arrow.active) continue
          arrow.x += arrow.vx
          arrow.y += arrow.vy
          if (arrow.x > W + 200) { arrow.active = false; continue }
          allGone = false
          drawArrow(ctx, arrow)

          for (const p of particles) {
            const ddx = p.x - arrow.x
            const ddy = p.y - arrow.y
            const d2 = ddx * ddx + ddy * ddy
            if (d2 < 9000) {
              const d = Math.sqrt(d2)
              const force = (95 - d) / 95
              const ang = Math.atan2(ddy, ddx)
              p.vx += Math.cos(ang) * force * 15
              p.vy += Math.sin(ang) * force * 15
              
              p.tx = p.x + (Math.random() - 0.5) * 300
              p.ty = p.y + (Math.random() - 0.5) * 300
            }
          }
        }

        if (allGone && !arrowsDone) {
          arrowsDone = true
          loopTimer2 = setTimeout(() => {
            if (!running) return
            phase = 'rebuild'
            
            loopTimer3 = setTimeout(() => {
              if (!running) return
              phase = 'idle'
              phaseProgress = 0
              
              loopTimer1 = setTimeout(() => {
                if (!running) return
                phase = 'arrows'
                arrowsDone = false
                spawnArrows()
              }, 4000)
            }, 2500)
          }, 800)
        }
      }

      // Breathing animation when stable
      if (phase === 'form' || phase === 'idle' || phase === 'rebuild') {
        const breathe = 1 + Math.sin(phaseProgress * 0.03) * 0.012
        particles.forEach((p) => {
          p.tx = cx + (offsetX + p.sx - cx) * breathe
          p.ty = cy + (offsetY + p.sy - cy) * breathe
        })
      }

      if (phase === 'form' && phaseProgress > 100) {
        phase = 'idle'
        phaseProgress = 0
        loopTimer1 = setTimeout(() => {
          if (!running) return
          phase = 'arrows'
          arrowsDone = false
          spawnArrows()
        }, 3000)
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    cleanupRef.current = () => {
      running = false
      cancelAnimationFrame(animRef.current)
      clearTimeout(loopTimer1)
      clearTimeout(loopTimer2)
      clearTimeout(loopTimer3)
    }
  }, [prefersReduced, isMobile])

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)
    }
    setSize()

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = girlfriendImg
    img.onload = () => runAnimation(canvas, img)

    const onResize = () => {
      cleanupRef.current?.()
      setSize()
      if (img.complete) runAnimation(canvas, img)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cleanupRef.current?.()
      window.removeEventListener('resize', onResize)
    }
  }, [inView, runAnimation])

  return (
    <section
      id="particle-heart"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #060810 50%, #0a0a0f 100%)',
      }}
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <p
          className="font-serif text-blush text-sm tracking-widest uppercase mb-3"
          style={{ letterSpacing: '0.3em' }}
        >
          My Full Heart ❤️
        </p>
        <p
          className="font-serif text-cream"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: 0.7,
          }}
        >
          Every inch of it belongs to you
        </p>
      </motion.div>

      {/* Heart canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{
          maxWidth: 'min(640px, 90vw)',
          aspectRatio: '1 / 1',
          margin: '0 auto',
        }}
      >
        {/* Glow behind heart */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '120%',
            height: '120%',
            left: '-10%',
            top: '-10%',
            background: 'radial-gradient(circle, rgba(233,30,140,0.15) 20%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-label="A heart-shaped photo of Siva, filled in — every inch of my heart belongs to her"
        />
      </motion.div>

      {/* Quote below */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ delay: 1.5, duration: 1.2 }}
        className="text-center max-w-2xl mx-auto px-6 mt-10"
      >
        <p
          className="font-serif text-cream"
          style={{
            fontSize: 'clamp(1.1rem, 3.2vw, 1.9rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}
        >
          {config.particleSection.quote}
        </p>
        <p className="text-2xl mt-5">{config.particleSection.attribution}</p>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
    </section>
  )
}
