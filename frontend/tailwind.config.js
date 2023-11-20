/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/App.tsx"
  ],
  theme: {
      colors: {
          gray: "#e0e1dd",
          primary: '#12161E',
          secondary: '#4a5568',
          tertiary: '#F4F9FF',
          hover: "#e0e7ff",
          darkgray: "#B6BAC6"

      },
      extend: {
          fontFamily: {
              body: ['OpenSans', 'sans-serif '],
              title: ['Poppins', 'cursive'],
          }
      },
  },
  plugins: [],
}