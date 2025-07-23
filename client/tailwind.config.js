export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-teal-500',
    'bg-green-600',
    'bg-purple-600',
    'bg-orange-600'
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['pixelfont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

