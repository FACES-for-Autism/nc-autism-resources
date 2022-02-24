module.exports = {
  purge: [
    './src/**/*.vue',
    './src/**/*.js',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: "#000000",
      gray: {
        100: '#e5e5e5',
        200: '#cccccc',
        300: '#b2b2b2',
        400: '#999999',
        500: '#808080',
        600: '#666666',
        700: '#4d4d4d',
        800: '#333333',
        900: '#1a1a1a'
      },
      blue: {
        100: '#84a0dc',
        200: '#728bcf',
        300: '#5b73bb',
        400: '#344891',
        500: '#4156a1',
        600: '#24347b',
        700: '#192668'
      },
      red: {
        100: '#ea1500',
        200: '#cc0000',
        300: '#b40000',
        400: '#7e0000',
        500: '#990000',
        600: '#5e0000',
        700: '#3e0000'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
