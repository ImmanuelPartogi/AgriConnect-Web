/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008000", // Warna utama
        plantGreen: "#4CAF50", // Hijau cerah
        lightGreen: "#81C784", // Hijau muda
        soilBrown: "#8D6E63", // Coklat tanah
        softGreen: "#daedd2", // Krem lembut
        goldenYellow: "#FFD54F", // Kuning padi
        Gainsboro: "#dcdcdc",
        Honeydew: "#f0fff0",
        WhiteSmoke: "#f5f5f5",
        russianGreen: '#679267',
        darkGray: '#a9a9a9',
        title: '#343a40',
      },
      fontFamily: {
        fontStatistik: ["sans-serif"],
      },
    },
  },
  plugins: [],
};
