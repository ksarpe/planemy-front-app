import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    port: 5173, //same as default one
    proxy: {
      // Jeśli frontend woła ścieżkę zaczynającą się od '/api/v1'
      "/api/v1": {
        // Przekaż ją do swojego backendu Go działającego lokalnie
        target: "http://localhost:8080", // <-- ZMIEŃ NA PORT, NA KTÓRYM DZIAŁA TWÓJ LOKALNY BACKEND GO
        changeOrigin: true,
        // Nie potrzebujesz 'rewrite', bo Twój backend Go
        // i tak nasłuchuje na ścieżkach /api/v1
      },
    },
  },
});
