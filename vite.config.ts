import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "./",
  plugins: [vue(), tailwindcss(), viteSingleFile()],
  server: {
    port: 3388,
    strictPort: true,
  },
}));
