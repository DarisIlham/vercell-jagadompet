import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [[react()], tailwindcss()],
  base: "/", // ini default, pastikan tidak diarahkan ke subfolder aneh
  build: {
    rollupOptions: {
      input: "/index.html",
    },
  },
  server: {
    historyApiFallback: true,
  },
});
