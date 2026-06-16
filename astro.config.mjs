import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // ⚡️ サーバー側でのリアルタイム処理（APIなど）を有効にする設定を追加します
  output: 'server'
});
