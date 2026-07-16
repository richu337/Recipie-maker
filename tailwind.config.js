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
          bg: '#0F172A',
          surface: '#1E293B',
          card: '#334155',
          accent: '#3B82F6',
          'accent-glow': '#60A5FA',
          gold: '#F59E0B',
          green: '#22C55E',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          orange: '#F97316',
          muted: '#64748B',
          'text': '#F1F5F9',
          'text-muted': '#94A3B8',
          'glass': 'rgba(30, 41, 59, 0.6)',
        },
        rarity: {
          common: '#94A3B8',
          uncommon: '#22C55E',
          rare: '#3B82F6',
          epic: '#8B5CF6',
          legendary: '#F97316',
        }
      },
      fontFamily: {
        game: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'count-up': 'countUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
