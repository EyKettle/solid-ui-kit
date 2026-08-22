import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin
  // generates the entries around src/App.tsx, wrapped in src/Document.tsx.
  // `vite build` prerenders the shell into dist/client/index.html.
  plugins: [solid({ start: true })],
  resolve: {
    // The preview site consumes the library by package name through its
    // `exports`, exactly like an external project does. Deduping the reactive
    // core reproduces a real consumer's singleton guarantee.
    dedupe: ["solid-js", "@solidjs/signals", "@solidjs/web"],
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    // Keep images as asset files instead of inlining them into the JS bundle.
    assetsInlineLimit: 0,
  },
});
