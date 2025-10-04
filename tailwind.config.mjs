/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005DAA',
          dark: '#00254D',
          light: '#0077CC'
        },
        secondary: {
          DEFAULT: '#7FFFD4',
          light: '#B2FFE8',
          dark: '#4DFFB8'
        },
        accent: {
          green: '#00FF88',
          mint: '#7FFFD4'
        },
        background: {
          base: '#F5F5F5',
          dark: '#00254D'
        },
        text: {
          primary: '#1E1E1E',
          secondary: '#4A4A4A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
