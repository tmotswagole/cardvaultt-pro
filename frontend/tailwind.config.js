/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ab: {
          red: '#CC0001',
          'red-dark': '#9A0001',
          'red-light': '#F5E6E6',
          navy: '#1A2744',
          'navy-mid': '#2B3F6B',
          'navy-light': '#D6DCF0',
          white: '#FFFFFF',
          surface: '#F7F8FA',
          'surface-2': '#EFF1F5',
          border: '#DDE1EA',
          muted: '#8E96A8',
          text: '#1A2744',
          'text-light': '#4A556B',
          success: '#1A7A4A',
          'success-bg': '#E6F4ED',
          warning: '#B45309',
          'warning-bg': '#FEF3C7',
          danger: '#CC0001',
          'danger-bg': '#F5E6E6',
          info: '#1B5FA8',
          'info-bg': '#E6EFF8',
        }
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['13px', '18px'],
        base: ['15px', '22px'],
        lg: ['18px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
      }
    },
  },
  plugins: [],
}
