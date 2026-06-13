/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'space-blue': {
          DEFAULT: '#12192B',
          light: '#1E293B',
          dark: '#0B0F19'
        },
        'nebula-purple': '#6366F1',
        'orion-gold': '#F59E0B',
        'mars-red': {
          DEFAULT: '#EF4444',
          dark: '#7F1D1D',
          pure: '#260000' // Fundo sutil para os cards no Modo Vermelho
        },
        'cosmic-silver': '#E2E8F0',
        'pure-black': '#000000',
        'pure-white': '#FFFFFF',
        'paper-light': '#F8FAFC' // Fundo sutil para o Modo Claro
      }
    },
  },
  plugins: [],
}