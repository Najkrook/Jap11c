/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCFB',
          100: '#F9F8F6',
          200: '#F3F0EA',
          300: '#E7E2D8',
          ruled: '#E5E9F0',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#334155',
          600: '#263344',
          700: '#1E293B',
          800: '#0F172A',
          900: '#0A0F1D',
          950: '#050810',
          navy: '#1A2B4C',
        },
        brand: {
          50: '#F0F5FA',
          100: '#E2ECF6',
          200: '#C7DAED',
          300: '#9FBFE0',
          400: '#5C93C4',
          500: '#255784',
          600: '#1A3B5C',
          700: '#112942',
          800: '#0C1E31',
          900: '#081422',
          950: '#050B12',
          gold: '#C89B3C',
          bronze: '#A6824B',
        },
        lund: {
          blue: '#1A3B5C',
          navy: '#112942',
          bronze: '#A6824B',
          gold: '#C89B3C',
          sky: '#F0F5FA',
          lightBlue: '#255784',
        },
        sakura: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFCCD6',
          300: '#FFA0B3',
          400: '#F06280',
          500: '#E04769',
          600: '#C72F50',
          950: '#2B0A12',
        },
        matcha: {
          50: '#F4F7F2',
          100: '#E3EDE0',
          500: '#4F7E42',
          600: '#3E6633',
          700: '#2E4C26',
        },
        sumi: {
          600: '#343E48',
          700: '#252D35',
          800: '#1A2026',
          900: '#12161A',
          950: '#0A0D10',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        japanese: ['"Hiragino Kaku Gothic ProN"', '"Meiryo"', '"Noto Sans JP"', '"Yu Gothic"', 'sans-serif'],
        calligraphy: ['"Yuji Boku"', '"Klee One"', '"Noto Serif JP"', 'serif'],
      },
      animation: {
        'bounce-short': 'bounce 0.8s ease-in-out 1',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(166, 130, 75, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(200, 155, 60, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
