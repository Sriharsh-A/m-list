/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mRed: '#e7222e',
        mDarkBlue: '#16588e',
        mLightBlue: '#81c4ff',
        mCarbon: '#0a0a0a',
      },
    },
  },
  plugins: [],
}