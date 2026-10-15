import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF9',
          100: '#FAF8F5',
          200: '#F3EFE9',
          300: '#E9E4DC',
        },
        charcoal: {
          950: '#11100F',
          900: '#181615',
          800: '#262321',
          700: '#3D3936',
          600: '#5C5652',
          400: '#8A837D',
          300: '#B0A9A2',
          200: '#CFCAC3',
          100: '#ECE8E3',
        },
        terracotta: {
          DEFAULT: '#A64B2A',
          hover: '#8E3F23',
          light: '#F8ECE7',
          dark: '#73321A',
        },
        olive: {
          DEFAULT: '#4D5343',
          light: '#EFF2ED',
          dark: '#353A2E',
        },
        parchment: '#EFECE6',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
