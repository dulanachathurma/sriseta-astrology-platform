/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0B1E',
        deep: '#10123B',
        card: '#161A45',
        gold: {
          DEFAULT: '#FACC15',
          bright: '#FACC15',
          soft: 'rgba(250, 204, 21, 0.18)',
        },
        copper: '#C1793B',
        ivory: '#F3EFE3',
        slate: {
          soft: '#9AA3C9',
        },
      },
      boxShadow: {
        gold: '0 0 40px rgba(250, 204, 21, 0.25)',
        'gold-lg': '0 25px 60px rgba(0,0,0,0.5), 0 0 60px rgba(250, 204, 21, 0.25)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(250, 204, 21, 0.08), transparent 60%)',
      },
      // මෙම කොටස එක් කරන්න:
      animation: {
        'orbit-slow': 'rotate 20s linear infinite',
        'orbit-reverse': 'rotate-reverse 20s linear infinite',
        'orbit': 'rotate 10s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rotate-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};