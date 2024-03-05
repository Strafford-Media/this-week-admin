const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './node_modules/@8thday/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.yellow,
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      maxHeight: (theme) => ({
        ...theme('spacing'),
      }),
      minWidth: (theme) => ({
        ...theme('spacing'),
      }),
      maxWidth: (theme) => ({
        ...theme('spacing'),
      }),
      inset: (theme) => ({
        ...theme('spacing'),
      }),
      spacing: {
        '1/3': '33.3333%',
        '2/3': '66.6667%',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        36: '9rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '100vw': '100vw',
        content: 'calc(100vh - 4rem)',
      },
      boxShadow: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Comme', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        sub: 'subgrid',
        ...Array(12)
          .fill(1)
          .reduce((gc, o, i) => ({ ...gc, [`auto-${o + i}`]: `repeat(${o + i}, minmax(0, auto))` }), {}),
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
}
