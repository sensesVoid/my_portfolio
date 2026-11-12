/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0E0E12',
          elevated: '#16161C',
          border: '#26262E',
          text: '#F2F2F5',
          muted: '#9A9AA8',
          accent: '#D4A017',
          'accent-hover': '#E8B830',
          'accent-light': '#F5D060',
          success: '#3FA34D',
          warning: '#F57F17',
          available: '#3FA34D',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'portrait-glow': '0 0 24px 4px rgba(212, 160, 23, 0.25)',
      },
    },
  },
  plugins: [],
};