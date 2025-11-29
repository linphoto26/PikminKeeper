/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // 掃描根目錄下的檔案 (如 App.tsx, index.tsx)
    "./components/**/*.{js,ts,jsx,tsx}", // 掃描 components 資料夾
    "./services/**/*.{js,ts,jsx,tsx}",   // 掃描 services 資料夾
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          'Helvetica', 
          'Arial', 
          'sans-serif', 
          '"Apple Color Emoji"', 
          '"Segoe UI Emoji"'
        ],
      },
      colors: {
        pikmin: {
          red: '#fca5a5',    // Pastel Red
          blue: '#93c5fd',   // Pastel Blue
          yellow: '#fde047', // Pastel Yellow
          purple: '#d8b4fe', // Pastel Purple
          white: '#f3f4f6',  // Pastel White/Gray
          rock: '#a8a29e',   // Pastel Rock/Stone
          winged: '#f9a8d4', // Pastel Pink
          ice: '#67e8f9',    // Pastel Cyan
        },
        mac: {
          glass: 'rgba(255, 255, 255, 0.65)',
          glassBorder: 'rgba(255, 255, 255, 0.4)',
          active: '#007AFF', // macOS Blue
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    }
  },
  plugins: [],
}
