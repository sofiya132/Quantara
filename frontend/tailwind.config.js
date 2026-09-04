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
        dark: {
          950: '#050716',
          900: '#080d26',
          850: '#0d1338',
          800: '#111846',
          700: '#19235e',
          600: '#253482',
          500: '#384aa8',
          400: '#5266d2',
        },
        purple: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b',
          950: '#0b0f33',
        },
        fuchsia: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
          950: '#0f0c33',
        },
        quantum: {
          purple: '#6366f1',
          violet: '#7c3aed',
          indigo: '#4f46e5',
          blurple: '#5865f2',
          lavender: '#a5b4fc',
          amethyst: '#6d28d9',
          pink: '#818cf8',
          fuchsia: '#8b5cf6',
          cyan: '#38bdf8',
          blue: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' },
          '100%': { boxShadow: '0 0 32px rgba(124, 58, 237, 0.75)' },
        }
      }
    },
  },
  plugins: [],
}


