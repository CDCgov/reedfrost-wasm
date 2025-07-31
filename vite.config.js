import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "",
  root: path.resolve(import.meta.dirname, "frontend"),
  server: {
    port: 7777,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend", "src"),
      "@wasm": path.resolve(import.meta.dirname, "pkg"),
    },
  },
});
