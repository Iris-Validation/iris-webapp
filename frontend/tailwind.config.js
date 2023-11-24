/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/App.tsx"
  ],
  theme: {
      colors: {
          gray: "#e0e1dd", // platinum background
          primary: '#12161E', // black
          secondary: '#4a5568', // dark gray
          tertiary: '#F4F9FF', // offwhite
          hover: "#F4F9FF", // offwhite
          darkgray: "#B6BAC6",
          lightgray: "#808080",
          black: "#000000",
          pastelred: "#FFA5A1",
          pastelyellow: "#FFDC85",
          pastelgreen: "#ABD9C9",
          pastelblue: "#9FB0D0",
          pastelpurple: "#9A8ABC"

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