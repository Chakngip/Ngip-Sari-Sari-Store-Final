/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ngip: {
          bg: '#0F1B12',        // deep sari-sari-store green
          panel: '#16241A',
          accent: '#F2B705',    // sari-sari signage yellow
          accent2: '#E8542E',   // jeepney orange-red
          text: '#EDEFE9',
          muted: '#93A08D',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
