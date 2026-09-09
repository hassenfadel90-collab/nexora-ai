import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-cairo)', 'var(--font-inter)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15,23,42,.08)',
        card: '0 10px 30px rgba(15,23,42,.06)'
      }
    }
  },
  plugins: []
}

export default config
