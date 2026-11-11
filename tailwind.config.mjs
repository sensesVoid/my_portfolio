/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1A1A24',
          elevated: '#1E1E2E',
          border: '#2D2D3E',
          text: '#E8E8ED',
          muted: '#8B8BA3',
          accent: '#1F4A9A',
          'accent-hover': '#2D6BCE',
          'accent-light': '#3A7BD8',
          success: '#2E7D32',
          warning: '#F57F17',
          available: '#2E7D32',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'portrait-glow': '0 0 24px 4px rgba(31, 74, 154, 0.4)',
      },
    },
  },
  plugins: [],
};