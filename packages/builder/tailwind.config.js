export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#dbe4ff', 200: '#bac8ff', 300: '#91a7ff',
          400: '#748ffc', 500: '#5c7cfa', 600: '#4c6ef5', 700: '#4263eb',
          800: '#3b5bdb', 900: '#364fc7',
        },
        surface: {
          0: '#ffffff', 1: '#f8f9fb', 2: '#f1f3f5', 3: '#e9ecef',
        },
        ide: {
          bg: '#1a1b23',
          panel: '#1f2029',
          toolbar: '#262730',
          surface: '#2a2b35',
          border: '#2e2f3a',
          'border-bright': 'rgba(255,255,255,0.12)',
          hover: '#2a2b35',
          active: 'rgba(255,255,255,0.08)',
          text: '#a8a29e',
          'text-dim': '#6b6560',
          'text-bright': '#ede9e3',
          'text-muted': '#857f78',
          accent: '#6366f1',
          'accent-dim': 'rgba(99,102,241,0.15)',
          'accent-border': 'rgba(99,102,241,0.3)',
        },
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'device': '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4)',
        'glow': '0 0 12px rgba(99,102,241,0.3)',
        'dropdown': '0 12px 40px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
