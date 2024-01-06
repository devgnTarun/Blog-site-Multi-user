/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3E9242",
          "orange": "#D48D3B",
          "green": "#3E9242"
        },
        secondary: "#282828",
        "neutral-black": "#23263B",
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
      maxWidth: {
        "10xl": '1440px'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        spaceGrotesk: ['Syne', 'sans-serif'],
      },
      borderRadius: {
        10: "10px"
      },
      screen: {
        "xs": "480px",
        "md": "700px",
        "sm": "600px",
      }
    },
  },
  plugins: [],
}

