import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { config } from '../../data/config'

gsap.registerPlugin(ScrollTrigger)

interface QuoteCardProps {
  quote: typeof config.quotes[0]
  index: number
}

function QuoteCard({ quote, index }: QuoteCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isLong = quote.text.length > 160

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 60, filter: 'blur(12px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative"
    >
      {/* Ambient bloom */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '50vw',
          height: '50vw',
          left: index % 2 === 0 ? '10%' : '40%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: index % 2 === 0
            ? 'radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10" style={isLong ? { maxWidth: '46rem' } : undefined}>
        {/* Decorative quote mark */}
        <motion.div
          className="font-serif text-rose opacity-20 mb-6"
          style={{ fontSize: '8rem', lineHeight: 0.8, fontWeight: 700 }}
        >
          "
        </motion.div>

        <p
          className="font-serif text-cream"
          style={{
            fontSize: isLong ? 'clamp(1.05rem, 2.6vw, 1.6rem)' : 'clamp(1.4rem, 4vw, 2.6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: isLong ? 1.85 : 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {quote.text}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: 'rgba(233,30,140,0.4)' }} />
          <span className="font-serif text-rose text-lg">{quote.author}</span>
          <div className="h-px w-16" style={{ background: 'rgba(233,30,140,0.4)' }} />
        </div>
      </div>
    </div>
  )
}

export default function LoveQuotes() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="quotes"
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #08080d 50%, #0a0a0f 100%)',
      }}
    >
      {/* Static floating hearts background */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="heart-particle"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '0',
            fontSize: `${12 + (i % 3) * 6}px`,
            '--dur': `${10 + i * 2}s`,
            '--del': `${i * 1.5}s`,
            '--dx': `${(i % 2 === 0 ? 1 : -1) * 20}px`,
          } as React.CSSProperties}
        >
          ❤️
        </div>
      ))}

      {config.quotes.map((quote, i) => (
        <QuoteCard key={i} quote={quote} index={i} />
      ))}
    </section>
  )
}
