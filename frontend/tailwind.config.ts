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
      boxShadow: {
        luxe: '0 24px 80px rgba(23, 18, 15, 0.12)',
        gold: '0 18px 45px rgba(185, 146, 75, 0.22)'
      }
    }
  },
  plugins: []
};

export default config;
