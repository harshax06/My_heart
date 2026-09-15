/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep': '#0a0a0f',
        'navy': '#0d1b2a',
        'gold': '#f4a849',
        'blush': '#f9a8d4',
        'coral': '#e8665a',
        'rose': '#e91e8c',
        'purple-mist': '#7c3aed',
        'cream': '#faf7f5',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'drift': 'drift 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(233,30,140,0.4)' },
          '50%': { boxShadow: '0 0 60px rgba(233,30,140,0.8), 0 0 100px rgba(233,30,140,0.4)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25px) scaleY(0.85)' },
        },
        drift: {
          '0%': { transform: 'translateY(100vh) translateX(-10px)' },
          '100%': { transform: 'translateY(-100px) translateX(10px)' },
        },
      },
    },
  },
  plugins: [],
}
