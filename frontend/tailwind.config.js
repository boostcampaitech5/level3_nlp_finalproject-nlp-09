/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [ "./src/**/*.{html,js}" ],
  theme: {
    extend: {

      colors: {
        'custom-green': '#10a37f',
        'custom-blue': "#25A2C3"
        // 다른 커스텀 색상을 추가할 수도 있습니다.
        // 'custom-red': '#ff0000',
        // 'custom-blue': '#0000ff',
        // ...
      },
      spacing: {
        '2.5': "10px",
        '2.8': "11px"
      }
    },
  },
  plugins: [],
}

