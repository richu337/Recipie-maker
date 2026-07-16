/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          bg: '#0f0f1a',
          surface: '#1a1a2e',
          card: '#16213e',
          accent: '#e94560',
          gold: '#f5c518',
          green: '#2ecc71',
          blue: '#3498db',
          purple: '#9b59b6',
          muted: '#6c7293',
          text: '#eaeaea',
          'text-muted': '#8892b0',
        }
      },
      fontFamily: {
        game: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

