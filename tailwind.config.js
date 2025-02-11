const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      width: {
        '8xl': '90rem;',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '2/4': '50%',
        '3/4': '75%',
        '8xl': '90rem',
      },
      colors: {
        theme: {
          white: '#fff',
          pale: '#f8f9f9',
          pale2: '#f8fbfa',
          light: '#f2f7f7',
          teal: '#00bfa6',
          lightteal: '#ecf5f4',
          verylightteal: '#edf5f4',
          blue: '#5a9de1',
          navyblue: '#275576',
          darkblue: '#172941',
          lightgray: '#eaecee',
          gray: '#dcdfe3',
          gray2: '#d9d9d9',
          gray3: '#d1d4d9',
          darkgray: '#818993',
          darkgray2: '#4D586A',
          orange: '#f7bd28',
          purple: '#8d66c5',
          black: '#0c0f18',
        },
      },
    },
    screens: {
      '2xs': '400px',
      xs: '520px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
