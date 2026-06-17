import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',  // ← これを追加または変更
  adapter: cloudflare({
    mode: 'advanced'
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});