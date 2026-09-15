import { lazy, Suspense } from 'react'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import CustomCursor from './components/CustomCursor/CustomCursor'
import SceneTransition from './components/SceneTransition/SceneTransition'
import HeartDivider from './components/HeartDivider/HeartDivider'
import MusicControl from './components/MusicControl/MusicControl'
import StoryNav from './components/StoryNav/StoryNav'
import HeroProposal from './components/HeroProposal/HeroProposal'
import BirthdayReveal from './components/BirthdayReveal/BirthdayReveal'
import ConfessionReveal from './components/ConfessionReveal/ConfessionReveal'
import LoveMessage from './components/LoveMessage/LoveMessage'
import LoveQuotes from './components/LoveQuotes/LoveQuotes'
import LoveCards from './components/LoveCards/LoveCards'
import PhotoMemories from './components/PhotoMemories/PhotoMemories'
import MemoryWall from './components/MemoryWall/MemoryWall'
import GiftBoxes from './components/GiftBoxes/GiftBoxes'
import FinalProposal from './components/FinalProposal/FinalProposal'

// Lazy-load the heavy particle section
const ParticleHeart = lazy(() => import('./components/ParticleHeart/ParticleHeart'))

function App() {
  return (
    <div className="relative" style={{ background: '#0a0a0f' }}>
      {/* Reusable heart-shaped clip path (objectBoundingBox = scales to any element) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.92 C0.15,0.68 0,0.42 0,0.25 C0,0.05 0.18,-0.05 0.35,0.05 C0.44,0.10 0.5,0.20 0.5,0.24 C0.5,0.20 0.56,0.10 0.65,0.05 C0.82,-0.05 1,0.05 1,0.25 C1,0.42 0.85,0.68 0.5,0.92 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Cinematic film grain (sitewide, subtle) ── */}
      <div
        className="grain-overlay fixed inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      />

      {/* ── Global UI overlays ── */}
      <CustomCursor />
      <ScrollProgress />
      <MusicControl />
      <StoryNav />

      {/* ── Story Sections ── */}
      {/* 1 — the welcome */}
      <HeroProposal />
      <HeartDivider />

      {/* 2 — the birthday wish comes first */}
      <SceneTransition><BirthdayReveal /></SceneTransition>
      <HeartDivider />

      {/* 3 — what she means to me */}
      <SceneTransition><LoveMessage /></SceneTransition>
      <SceneTransition intensity={1.4}><LoveQuotes /></SceneTransition>

      {/* 4 — her heart, made of her */}
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: '#0a0a0f' }}
          >
            <div>
              <span
                className="text-4xl font-serif"
                style={{
                  color: '#e91e8c',
                  animation: 'heartbeat 1.5s ease-in-out infinite',
                  display: 'inline-block',
                }}
              >
                ❤️
              </span>
            </div>
          </div>
        }
      >
        <ParticleHeart />
      </Suspense>

      <HeartDivider />

      {/* 5 — us, remembered */}
      <SceneTransition><LoveCards /></SceneTransition>
      <SceneTransition intensity={1.3}><PhotoMemories /></SceneTransition>
      <SceneTransition><MemoryWall /></SceneTransition>
      <SceneTransition><GiftBoxes /></SceneTransition>
      <HeartDivider size={104} />

      {/* 6 — the confession, then the proposal on the beach */}
      <SceneTransition><ConfessionReveal /></SceneTransition>
      <FinalProposal />

      {/* ── Footer ── */}
      <footer
        className="py-10 text-center relative"
        style={{
          background: 'linear-gradient(to top, #0a0a0f, #0d0812)',
          borderTop: '1px solid rgba(233,30,140,0.08)',
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12" style={{ background: 'rgba(233,30,140,0.3)' }} />
          <span className="text-xl">❤️</span>
          <div className="h-px w-12" style={{ background: 'rgba(233,30,140,0.3)' }} />
        </div>
        <p
          className="font-serif text-blush text-sm"
          style={{ fontStyle: 'italic', opacity: 0.7 }}
        >
          Made with love by Harshaa — for Siva
        </p>
        <p
          className="font-sans text-xs mt-1"
          style={{ color: 'rgba(250,247,245,0.25)', letterSpacing: '0.1em' }}
        >
          Happy 20th Birthday, Bangaram ❤️
        </p>
      </footer>
    </div>
  )
}

export default App
