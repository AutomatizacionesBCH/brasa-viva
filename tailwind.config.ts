import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-archivo)', 'Archivo Black', 'Impact', 'sans-serif'],
      },
      colors: {
        brasa: { DEFAULT: '#EA580C', dark: '#C2410C', light: '#FB923C' }, // naranja brasa
        carbon: { DEFAULT: '#1C1917', soft: '#292524' },                   // carbón
        crema: '#FAF7F2',                                                  // fondo cálido
        dorado: '#D97706',                                                 // acento
      },
    },
  },
  plugins: [],
};
export default config;
