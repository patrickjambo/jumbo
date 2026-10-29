/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Design Tokens ───────────────────────────────────────────────────────
      colors: {
        // Brand — Jumbo violet/indigo
        brand: {
          50:  'hsl(252 100% 97%)',
          100: 'hsl(252 90% 93%)',
          200: 'hsl(252 80% 84%)',
          300: 'hsl(252 75% 72%)',
          400: 'hsl(252 70% 60%)',
          500: 'hsl(252 65% 50%)',   // primary
          600: 'hsl(252 65% 42%)',
          700: 'hsl(252 65% 34%)',
          800: 'hsl(252 65% 22%)',
          900: 'hsl(252 65% 14%)',
        },
        // Accent — electric cyan
        accent: {
          50:  'hsl(188 100% 97%)',
          100: 'hsl(188 95% 90%)',
          200: 'hsl(188 90% 78%)',
          300: 'hsl(188 85% 60%)',
          400: 'hsl(188 80% 48%)',
          500: 'hsl(188 80% 38%)',   // accent
        },
        // Dark background scale
        surface: {
          base:  'hsl(240 20% 5%)',   // deepest bg
          1:     'hsl(240 18% 8%)',
          2:     'hsl(240 16% 12%)',
          3:     'hsl(240 14% 16%)',
          4:     'hsl(240 12% 20%)',
          glass: 'hsl(240 20% 14% / 0.6)',
        },
        // Quiz answer colours (4 distinct, spec §19)
        quiz: {
          a: 'hsl(338 80% 56%)', // red-pink  ◆
          b: 'hsl(35 90% 55%)',  // amber     ▲
          c: 'hsl(160 70% 42%)', // green     ●
          d: 'hsl(212 80% 55%)', // blue      ■
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: {
        card:  '20px',
        panel: '16px',
        btn:   '12px',
        pill:  '9999px',
      },
      boxShadow: {
        glass: '0 8px 32px hsl(240 20% 5% / 0.4), inset 0 1px 0 hsl(255 100% 100% / 0.06)',
        'glass-lg': '0 20px 60px hsl(240 20% 5% / 0.6), inset 0 1px 0 hsl(255 100% 100% / 0.08)',
        glow:    '0 0 20px hsl(252 65% 50% / 0.4)',
        'glow-accent': '0 0 20px hsl(188 80% 48% / 0.4)',
      },
      backdropBlur: {
        glass: '20px',
        'glass-sm': '12px',
      },
      transitionDuration: {
        quick:  '120ms',
        normal: '250ms',
        slow:   '400ms',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'countdown-drain': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '283' }, // 2πr for r=45
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'fade-in': 'fade-in 0.3s ease forwards',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
