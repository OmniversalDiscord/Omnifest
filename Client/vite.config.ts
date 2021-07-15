import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "vite-plugin-svgr";
import reactJsx from "vite-react-jsx";
import brotli from "rollup-plugin-brotli";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("three")) {
            return "three";
          } else if (id.includes("react")) {
            return "react";
          } else if (id.includes("node_modules")) {
            return "vendor";
          } else {
            return "index";
          }
        }
      },
      plugins: [brotli()]
    }
  },
  plugins: [reactRefresh(), svgr(), reactJsx()],
});
