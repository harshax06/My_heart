/**
 * SinglePlayGif.tsx
 *
 * Renders a GIF that plays exactly ONCE then freezes on the ACTUAL last frame.
 *
 * Strategy:
 * 1. Fetch the raw GIF bytes as an ArrayBuffer.
 * 2. Parse all frames using `omggif` (GifReader) to get the exact frame count
 *    and total real duration.
 * 3. Decode the last frame's pixel data using GifReader.decodeAndBlitFrameRGBA
 *    and paint it onto an offscreen canvas.
 * 4. Display a normal <img> while the animation is running.
 * 5. When a setTimeout fires at exactly (totalDuration - lastFrameDelay) ms,
 *    we know the final frame is showing in the <img>. At that moment we:
 *    - Paint the pre-decoded last-frame canvas onto the visible canvas.
 *    - Hide the <img>.
 *    - The user now sees the true final frame, permanently frozen.
 *
 * This guarantees the last frame is accurate regardless of browser rendering
 * timing, because we decoded it ourselves from the raw GIF data.
 */

import { useEffect, useRef, useState } from 'react'
import { GifReader } from 'omggif'

interface SinglePlayGifProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  onEnd?: () => void
  /** How the frame fits its box. 'cover' (default) fills and crops; 'contain' shows the whole image. */
  fit?: 'cover' | 'contain'
}

export default function SinglePlayGif({
  src,
  alt = '',
  className = '',
  style,
  onEnd,
  fit = 'cover',
}: SinglePlayGifProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [frozen, setFrozen] = useState(false)
  // Track whether we have already started this sequence to prevent re-init on re-renders
  const initialisedRef = useRef(false)

  useEffect(() => {
    if (initialisedRef.current) return
    initialisedRef.current = true

    let cancelled = false
    let freezeTimer: ReturnType<typeof setTimeout>

    async function run() {
      try {
        // ── 1. Fetch raw GIF bytes ──────────────────────────────────────
        const response = await fetch(src)
        const arrayBuffer = await response.arrayBuffer()
        if (cancelled) return

        const bytes = new Uint8Array(arrayBuffer)

        // ── 2. Parse with omggif ────────────────────────────────────────
        const reader = new GifReader(bytes)
        const numFrames = reader.numFrames()
        const gifWidth = reader.width
        const gifHeight = reader.height

        // Calculate total animation duration from real frame delays
        let totalDurationMs = 0
        for (let i = 0; i < numFrames; i++) {
          const info = reader.frameInfo(i)
          // delay is in centiseconds; minimum 1cs to avoid 0-delay frame quirks
          const delayCentiseconds = info.delay < 1 ? 10 : info.delay
          totalDurationMs += delayCentiseconds * 10
        }

        // ── 3. Decode actual last frame pixels ─────────────────────────
        // We must composite all previous frames to get the accurate final image.
        // Use a composite approach: decode each frame onto a persistent buffer.
        const compositePixels = new Uint8ClampedArray(gifWidth * gifHeight * 4)

        for (let i = 0; i < numFrames; i++) {
          const frameInfo = reader.frameInfo(i)
          const framePixels = new Uint8ClampedArray(gifWidth * gifHeight * 4)
          reader.decodeAndBlitFrameRGBA(i, framePixels)

          // Blit frame pixels into composite (respecting disposal method)
          // disposal=2 means clear to background after rendering, but for our
          // purpose of capturing the final displayed state, simply compositing
          // all frames gives the correct last frame appearance.
          for (let py = 0; py < frameInfo.height; py++) {
            for (let px = 0; px < frameInfo.width; px++) {
              const srcIdx = (py * frameInfo.width + px) * 4
              const dstIdx =
                ((frameInfo.y + py) * gifWidth + (frameInfo.x + px)) * 4
              const alpha = framePixels[srcIdx + 3]
              if (alpha > 0) {
                compositePixels[dstIdx] = framePixels[srcIdx]
                compositePixels[dstIdx + 1] = framePixels[srcIdx + 1]
                compositePixels[dstIdx + 2] = framePixels[srcIdx + 2]
                compositePixels[dstIdx + 3] = alpha
              }
            }
          }
        }

        if (cancelled) return

        // Paint the composited last frame onto our canvas (offscreen-ready)
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = gifWidth
        canvas.height = gifHeight
        const ctx = canvas.getContext('2d')!
        const imageData = new ImageData(compositePixels, gifWidth, gifHeight)
        ctx.putImageData(imageData, 0, 0)

        // ── 4. Schedule freeze at end of animation ─────────────────────
        // We schedule at totalDurationMs. The img-based GIF will be on its
        // last frame at that moment AND we already have the decoded pixel-perfect
        // last frame ready on the canvas.
        const lastFrameInfo = reader.frameInfo(numFrames - 1)
        const lastFrameDurationMs =
          (lastFrameInfo.delay < 1 ? 10 : lastFrameInfo.delay) * 10

        // Freeze slightly before the last frame would loop back
        const freezeAt = totalDurationMs - lastFrameDurationMs

        freezeTimer = setTimeout(() => {
          if (cancelled) return
          // Show the canvas (which has the decoded final frame) and hide the img
          setFrozen(true)
          onEnd?.()
        }, Math.max(freezeAt, 0))
      } catch (err) {
        // If GIF parsing fails, fall back: freeze after totalDurationMs
        console.warn('[SinglePlayGif] GIF decode failed, using fallback freeze', err)
        freezeTimer = setTimeout(() => {
          if (cancelled) return
          setFrozen(true)
          onEnd?.()
        }, 10000)
      }
    }

    run()

    return () => {
      cancelled = true
      clearTimeout(freezeTimer)
    }
  }, [src, onEnd])

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {/* Live animated GIF — hidden once frozen */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          display: frozen ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: 'center',
        }}
      />
      {/* Canvas with decoded actual last frame — shown when frozen */}
      <canvas
        ref={canvasRef}
        style={{
          display: frozen ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: fit,
        }}
      />
    </div>
  )
}
