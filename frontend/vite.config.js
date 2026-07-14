import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // The logo (~3.6KB) sits just under Vite's default 4KB inline threshold and
    // was getting base64-inlined into the main JS chunk instead of staying a
    // separate cacheable file. No other asset in this project is anywhere near
    // that size, so disabling inlining entirely is effectively scoped to it.
    assetsInlineLimit: 0,
  },
})
