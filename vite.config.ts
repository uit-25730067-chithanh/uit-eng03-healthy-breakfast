import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : 'https://uit-25730067-chithanh.github.io/uit-eng03-healthy-breakfast/',
  plugins: [
    vue(),
    tailwindcss(),
    viteSingleFile(),
  ],
  server: {
    port: 3388,
    strictPort: true
  }
}));
