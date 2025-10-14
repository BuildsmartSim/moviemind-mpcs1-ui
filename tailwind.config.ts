import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mm-bg-0': 'var(--mm-bg-0)',
        'mm-bg-1': 'var(--mm-bg-1)',
        'mm-text-dark': 'var(--mm-text-on-dark)',
        'mm-text-card': 'var(--mm-text-on-card)',
        'mm-amber': 'var(--mm-amber)',
        'mm-teal': 'var(--mm-teal)'
      },
      fontFamily: {
        sans: ['"Satoshi"', '"Neue Haas Grotesk"', 'Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        'mm-card': '0 10px 30px rgba(0,0,0,0.45)',
        'mm-amber-glow': '0 0 16px rgba(242,197,106,0.25)',
        'mm-teal-glow': '0 0 16px rgba(72,224,210,0.25)'
      },
      transitionTimingFunction: {
        'mm-fade': 'cubic-bezier(0.22, 0.61, 0.36, 1)'
      }
    }
  },
  plugins: []
};

export default config;
