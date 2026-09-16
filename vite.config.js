import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  base: "./",            // relative Pfade, damit es auch in der App-Hülle läuft
  build: { outDir: "dist", assetsInlineLimit: 0 },
});
