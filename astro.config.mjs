import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    runtime: 'nodejs22.x',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});