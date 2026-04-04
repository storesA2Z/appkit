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
          bg: '#0f0f14',
          panel: '#141419',
          toolbar: '#18181f',
          border: 'rgba(255,255,255,0.06)',
          'border-bright': 'rgba(255,255,255,0.12)',
          hover: 'rgba(255,255,255,0.04)',
          active: 'rgba(255,255,255,0.08)',
          text: '#6b7280',
          'text-dim': '#4b5563',
          'text-bright': '#e2e8f0',
          'text-muted': '#94a3b8',
          accent: '#818cf8',
          'accent-dim': 'rgba(129,140,248,0.15)',
          'accent-border': 'rgba(129,140,248,0.3)',
        },
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'device': '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4)',
        'glow': '0 0 12px rgba(129,140,248,0.3)',
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
