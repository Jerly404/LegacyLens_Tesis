/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        legacy: {
          bg: '#0F1117',
          card: '#151821',
          'card-hover': '#1A1E2B',
          'card-active': '#1E2333',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.12)',
          'border-highlight': 'rgba(59, 130, 246, 0.3)',
          primary: '#3B82F6',
          'primary-dark': '#2563EB',
          'primary-glow': 'rgba(59, 130, 246, 0.15)',
          secondary: '#7C3AED',
          'secondary-dark': '#6D28D9',
          'secondary-glow': 'rgba(124, 58, 237, 0.15)',
          text: '#FFFFFF',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#06B6D4',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#0F1117',
          card: '#151821',
          cardHover: '#1A1E2B',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace']
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
        'glow-secondary': '0 0 25px -5px rgba(124, 58, 237, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'pulse-slow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
