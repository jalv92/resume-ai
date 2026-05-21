/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f6f5f1',
          100: '#ecebe4',
          200: '#d6d4c6',
          300: '#a8a596',
          400: '#6e6c61',
          500: '#3e3d37',
          600: '#2a2924',
          700: '#1c1b18',
          800: '#131210',
          900: '#0a0a08',
        },
        indigo: {
          50: '#eef0ff',
          100: '#dde1ff',
          400: '#7c83ff',
          500: '#5b62f4',
          600: '#4348d8',
          700: '#3437a8',
          800: '#262879',
          900: '#1a1c54',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.08)',
        lift: '0 2px 4px 0 rgb(0 0 0 / 0.05), 0 24px 48px -16px rgb(0 0 0 / 0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 400ms ease-out',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
