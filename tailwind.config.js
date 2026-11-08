/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tells Tailwind where to look for class usage so unused styles are purged in production
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  // Dark mode controlled by a 'dark' class on the <html> element (via ThemeService)
  darkMode: 'class',
  theme: {
    extend: {
      // ─── BLUE-CENTRIC COLOR PALETTE ───────────────────────────────────
      colors: {
        // Primary brand blues — used for CTAs, active states, accents
        blue: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Cyan accents — secondary highlights and glow effects
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        // Dark background palette for dark mode
        dark: {
          900: '#020817',   // deepest background
          800: '#0a1628',   // card backgrounds
          700: '#0f2040',   // elevated surfaces
          600: '#1a3a6b',   // borders, dividers
        }
      },
      // ─── TYPOGRAPHY ───────────────────────────────────────────────────
      fontFamily: {
        // Display font — headings and hero text (loaded via Google Fonts in index.html)
        display: ['Syne', 'sans-serif'],
        // Body font — readable for long-form content
        body: ['DM Sans', 'sans-serif'],
        // Mono — code snippets and tag chips
        mono: ['JetBrains Mono', 'monospace'],
      },
      // ─── ANIMATIONS ───────────────────────────────────────────────────
      animation: {
        'fade-up':        'fadeUp 0.6s ease forwards',
        'fade-in':        'fadeIn 0.4s ease forwards',
        'slide-in-left':  'slideInLeft 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'pulse-glow':     'pulseGlow 2s ease-in-out infinite',
        'float':          'float 3s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '50%':       { boxShadow: '0 0 40px rgba(59,130,246,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // ─── SPACING & SIZING ─────────────────────────────────────────────
      backgroundImage: {
        // Mesh gradient for hero backgrounds
        'blue-mesh':  'radial-gradient(at 40% 20%, #1d4ed8 0, transparent 50%), radial-gradient(at 80% 0%, #06b6d4 0, transparent 50%), radial-gradient(at 0% 50%, #1e3a8a 0, transparent 50%)',
        'dark-mesh':  'radial-gradient(at 40% 20%, #172554 0, transparent 50%), radial-gradient(at 80% 0%, #0a1628 0, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'blue-sm':  '0 0 10px rgba(59,130,246,0.2)',
        'blue-md':  '0 0 20px rgba(59,130,246,0.35)',
        'blue-lg':  '0 0 40px rgba(59,130,246,0.5)',
        'blue-xl':  '0 0 60px rgba(59,130,246,0.6)',
        'inner-blue': 'inset 0 0 30px rgba(59,130,246,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
