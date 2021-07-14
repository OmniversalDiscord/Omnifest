module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: true, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    fontFamily: {
      'mono': ['Fira\\ Code', 'monospace']
    },
    extend: {
      zIndex: {
        '-10': '-10',
      },
      transitionProperty: {
        'width': 'width'
      },
    },
  },
  variants: {
    extend: {
      width: ['group-hover']
    },
  },
  plugins: [],
};
