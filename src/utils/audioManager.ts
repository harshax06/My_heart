/**
 * audioManager.ts
 *
 * Global singleton audio manager that lives entirely outside of the React
 * lifecycle. This guarantees:
 *  - Exactly one HTMLAudioElement at any time.
 *  - No audio restarts on React re-renders.
 *  - Clean track transitions (stop old → start new).
 *  - Autoplay with first-interaction fallback.
 *  - Observable play/pause/mute state for React components.
 */

type TrackName = 'kalava' | 'proposal'
type StateListener = (state: AudioState) => void

export interface AudioState {
  playing: boolean
  muted: boolean
  trackName: TrackName | null
  waitingForInteraction: boolean
}

const TRACKS: Record<TrackName, string> = {
  kalava: '/kalava.mp3',
  proposal: '/proposal.mp3',
}

// ─── Singleton State ───────────────────────────────────────────────────────────
let _audio: HTMLAudioElement | null = null
let _currentTrack: TrackName | null = null
let _pendingTrack: TrackName | null = null
let _waitingForInteraction = false
let _listeners: StateListener[] = []
let _startedOnce = false // prevent double-init on StrictMode
let _interactionHandlerAttached = false

function _getState(): AudioState {
  return {
    playing: _audio ? !_audio.paused : false,
    muted: _audio ? _audio.muted : false,
    trackName: _currentTrack,
    waitingForInteraction: _waitingForInteraction,
  }
}

function _notify() {
  const state = _getState()
  _listeners.forEach((fn) => fn(state))
}

function _removeInteractionListeners(handler: () => void) {
  window.removeEventListener('click', handler)
  window.removeEventListener('touchstart', handler)
  window.removeEventListener('keydown', handler)
  window.removeEventListener('scroll', handler)
}

function _attemptPlay() {
  if (!_audio) return

  _audio
    .play()
    .then(() => {
      _waitingForInteraction = false
      _notify()
    })
    .catch(() => {
      // Browser blocked autoplay — queue on first interaction
      if (_interactionHandlerAttached) return
      _interactionHandlerAttached = true
      _waitingForInteraction = true
      _notify()

      const handler = () => {
        if (!_audio) return
        _removeInteractionListeners(handler)
        _interactionHandlerAttached = false
        _waitingForInteraction = false

        // If a new track was requested while we were waiting, play that instead
        if (_pendingTrack && _pendingTrack !== _currentTrack) {
          _loadAndPlay(_pendingTrack)
          _pendingTrack = null
        } else {
          _audio.play().catch(() => {})
        }
        _notify()
      }

      window.addEventListener('click', handler)
      window.addEventListener('touchstart', handler)
      window.addEventListener('keydown', handler)
      window.addEventListener('scroll', handler)
    })
}

function _loadAndPlay(trackName: TrackName) {
  // Tear down any existing audio element
  if (_audio) {
    _audio.pause()
    _audio.src = ''
    _audio.load()
    _audio = null
  }

  _currentTrack = trackName
  _audio = new Audio(TRACKS[trackName])
  _audio.loop = false
  _audio.volume = 0.5
  _audio.muted = false

  _audio.addEventListener('ended', () => {
    _notify()
  })

  _audio.addEventListener('pause', () => {
    _notify()
  })

  _audio.addEventListener('play', () => {
    _notify()
  })

  _attemptPlay()
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Start a named track. Stops any current track first.
 * Safe to call multiple times — will not create duplicate elements.
 */
export function playTrack(trackName: TrackName) {
  // If this track is already playing, do nothing
  if (_currentTrack === trackName && _audio && !_audio.paused) return

  // If we're waiting for interaction for another track and same track requested
  if (_currentTrack === trackName && _waitingForInteraction) return

  _pendingTrack = trackName

  if (_interactionHandlerAttached) {
    // Will pick up the pending track when user interacts
    return
  }

  _loadAndPlay(trackName)
  _notify()
}

/** Stop all audio and clean up. */
export function stopAll() {
  if (_audio) {
    _audio.pause()
    _audio.src = ''
    _audio.load()
    _audio = null
  }
  _currentTrack = null
  _pendingTrack = null
  _waitingForInteraction = false
  _notify()
}

/** Toggle pause / resume on the current track. */
export function togglePlay() {
  if (!_audio) return
  if (_audio.paused) {
    _audio.play().catch(() => {})
  } else {
    _audio.pause()
  }
  _notify()
}

/** Toggle mute on the current track. */
export function toggleMute() {
  if (!_audio) return
  _audio.muted = !_audio.muted
  _notify()
}

/** Subscribe to state changes. Returns an unsubscribe function. */
export function subscribe(listener: StateListener): () => void {
  _listeners.push(listener)
  // Immediately emit current state
  listener(_getState())
  return () => {
    _listeners = _listeners.filter((l) => l !== listener)
  }
}

/** Get current state snapshot (for non-reactive reads). */
export function getState(): AudioState {
  return _getState()
}

/** 
 * Call once at app startup to attempt the landing track.
 * Guards against StrictMode double-calls and re-renders.
 */
export function initLandingAudio() {
  if (_startedOnce) return
  _startedOnce = true
  playTrack('kalava')
}
