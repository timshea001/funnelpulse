import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6B35',
          50: '#FFE8E0',
          100: '#FFD9CC',
          200: '#FFBCA3',
          300: '#FF9F7A',
          400: '#FF8551',
          500: '#FF6B35',
          600: '#FF4400',
          700: '#CC3700',
          800: '#992900',
          900: '#661C00',
        },
      },
    },
  },
  plugins: [],
}
export default config
