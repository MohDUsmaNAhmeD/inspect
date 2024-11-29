// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'glitch-1': 'glitch-1 1s infinite linear alternate-reverse',
        'glitch-2': 'glitch-2 0.7s infinite linear alternate-reverse',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'glitch-1': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px)' },
          '40%': { transform: 'translate(-5px, -5px)' },
          '60%': { transform: 'translate(5px, 5px)' },
          '80%': { transform: 'translate(5px, -5px)' }
        },
        'glitch-2': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(5px, -5px)' },
          '40%': { transform: 'translate(5px, 5px)' },
          '60%': { transform: 'translate(-5px, -5px)' },
          '80%': { transform: 'translate(-5px, 5px)' }
        }
      },
    },
  },
  plugins: [],
}