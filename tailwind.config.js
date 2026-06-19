/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Cinzel', 'serif'],
        'body': ['Outfit', 'sans-serif'],
        'mono': ['Courier Prime', 'monospace'],
      },
      colors: {
        neon: {
          red: '#FF2D55',
          blue: '#00C3FF',
          yellow: '#FFE500',
          amber: '#FF8C00',
          magenta: '#FF00CC',
          cyan: '#00FFF5',
        }
      },
      animation: {
        'bounce-slow': 'bounce 0.6s infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'slide-down': 'slideDown 0.4s ease-out',
        'vine-pulse': 'vinePulse 1s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 15px currentColor' },
          '50%': { boxShadow: '0 0 15px currentColor, 0 0 40px currentColor, 0 0 80px currentColor' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        vinePulse: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' },
        }
      }
    },
  },
  plugins: [],
}
