import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'advanced',
    session: {
      enabled: true,
      kvBindingName: 'SESSION',
    }
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});
