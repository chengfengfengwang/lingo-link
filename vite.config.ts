import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from "@crxjs/vite-plugin";
import manifestConfig from "./manifest.config";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: manifestConfig })],
  server: {
    port: 8899
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
