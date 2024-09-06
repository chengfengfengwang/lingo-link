import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from "@crxjs/vite-plugin";
import manifestConfig from "./manifest.config";
import { resolve } from "path";

let buildOptions = {};
const browserTarget = process.env.BUILD_TARGET;
if (browserTarget === 'firefox') {
  buildOptions = {
    outDir: 'dist/firefox',
    rollupOptions: {
      input: {
        background: "background.html",
      }
    }
  }
} 
if (browserTarget === 'chrome') {
  buildOptions = {
    outDir: 'dist/chrome'
  }
} 
if (browserTarget === 'edge') {
  buildOptions = {
    outDir: 'dist/edge'
  }
} 


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
  build: buildOptions
})
