/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        custom: ["'Press Start 2P'", "system-ui"],
      },
    },
    
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'text': '#2B262D',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'main' : '#FDE49E',
      'hover' : '#D8B384',
      'secondary' : '#6DC5D1',
      'tertiary': '#9F496E'
    },
  },
  plugins: [],
}

