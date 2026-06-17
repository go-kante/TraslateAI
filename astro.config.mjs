import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build
export default defineConfig({
  // ⚡️ サーバー側でのリアルタイム処理（APIなど）を有効にする設定を追加します
  output: 'server',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  }
});