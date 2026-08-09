/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff5f8',
          100: '#ffe4ec',
          200: '#ffc9db',
          300: '#ffa0c1',
          400: '#ff6fa1',
          500: '#ff4785',
          600: '#e63272',
        },
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        serif: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseHeart: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        pulseHeart: 'pulseHeart 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
