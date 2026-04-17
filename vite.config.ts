import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/uit-eng03-healthy-breakfast/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    port: 3388,
    strictPort: true
  }
});
