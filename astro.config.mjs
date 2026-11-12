import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://portfolio-weld-sigma-1l5rpojwjt.vercel.app',
  integrations: [mdx(), sitemap(), tailwind()],
  output: 'static',
  trailingSlash: 'always',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});