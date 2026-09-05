/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06080C',
          900: '#0B0E14',
          850: '#10141D',
          800: '#171D2A',
          700: '#222B3D',
        },
        cyan: {
          400: '#00F5FF',
          500: '#00D8E6',
        },
        acid: {
          400: '#39FF14',
        },
        alert: {
          500: '#FF3B30',
        },
        gold: {
          400: '#FFB300',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px #00F5FF)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px #00F5FF)' },
        }
      }
    },
  },
  plugins: [],
}
