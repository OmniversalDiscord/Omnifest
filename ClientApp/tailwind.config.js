module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: true, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    fontFamily: {
      'mono': ['Fira\\ Code', 'monospace']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
