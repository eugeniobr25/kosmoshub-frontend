/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do RED MODE (Observação)
        'astro-black': '#050505',
        'astro-red': '#8b0000',
        'custom-red-light': '#ff3333', 
        
        // Cores do LIGHT MODE (Dia a dia)
        'sky-blue': '#0a192f', 
        'paper-white': '#f8f9fa',
        
        // Cores do NOVO DARK MODE (Descanso visual)
        'night-bg': '#1e293b',    // Fundo azul ardósia escuro
        'night-surface': '#334155', // Cartões e menus no dark mode
        'night-text': '#cbd5e1'     // Texto cinza claro
      }
    },
  },
  plugins: [],
}