/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iqoo: {
          bg: '#08090C',
          surface: '#0F1117',
          surface2: '#161922',
          surface3: '#1E2330',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderGlow: 'rgba(255, 200, 0, 0.35)',
          yellow: '#FFC800',
          yellowHover: '#FFE043',
          yellowDim: 'rgba(255, 200, 0, 0.12)',
          amber: '#F5A623',
          cyan: '#00F0FF',
          cyanDim: 'rgba(0, 240, 255, 0.12)',
          red: '#FF3B30',
          green: '#30D158',
          textMuted: '#8E95A5',
          textDim: '#5B6275',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-yellow': '0 0 35px -5px rgba(255, 200, 0, 0.25)',
        'glow-yellow-sm': '0 0 15px -3px rgba(255, 200, 0, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'phone': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(255, 200, 0, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'route-dash': 'routeDash 20s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        routeDash: {
          'to': { strokeDashoffset: '-1000' },
        }
      }
    },
  },
  plugins: [],
}
