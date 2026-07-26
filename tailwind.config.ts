import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // Core brand palette - Blue + White
        primary: {
          DEFAULT: '#2563EB', // blue-600
          light: '#60A5FA', // blue-400
          dark: '#1D4ED8', // blue-700
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          DEFAULT: '#F8FAFC', // page background (slate-50)
          card: 'rgba(255, 255, 255, 0.6)', // glass card fill
          border: 'rgba(255, 255, 255, 0.4)', // glass border
        },
        ink: {
          primary: '#0F172A', // slate-900
          secondary: '#475569', // slate-600
          muted: '#94A3B8', // slate-400
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-jakarta)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem', // 14px - inputs/buttons
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px - cards (glassmorphism standard)
        '4xl': '2rem', // 32px - hero panels
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.08)',
        'glass-lg': '0 12px 40px rgba(37, 99, 235, 0.18)',
        'glass-hover': '0 8px 30px rgba(37, 99, 235, 0.12)',
        'glow-primary': '0 0 0 3px rgba(37, 99, 235, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-hero':
          'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FFFFFF 100%)',
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        'gradient-radial-blue':
          'radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(96,165,250,0) 70%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-dot': {
          '0%, 80%, 100%': { opacity: '0.3' },
          '40%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
