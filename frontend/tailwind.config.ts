import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17120f',
        ivory: '#fffaf0',
        cream: '#f7efe1',
        champagne: '#e8d7b6',
        gold: '#b9924b',
        obsidian: '#0f0d0b'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        luxe: '0 24px 80px rgba(23, 18, 15, 0.13)',
        gold: '0 18px 45px rgba(185, 146, 75, 0.22)'
      },
      backgroundImage: {
        'hero-luxe': 'radial-gradient(circle at 18% 20%, rgba(185,146,75,.26), transparent 30%), linear-gradient(135deg, #fffaf0 0%, #f7efe1 52%, #17120f 52%, #0f0d0b 100%)'
      }
    }
  },
  plugins: []
};

export default config;
