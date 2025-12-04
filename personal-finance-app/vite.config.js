import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~vuetify": path.resolve(__dirname, "./node_modules/vuetify"),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@use "@/styles/variables" as *;`,
  //     },
  //   },
  // },
});
