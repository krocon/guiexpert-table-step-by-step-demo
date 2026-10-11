import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: { dedupe: ["solid-js"] },     // exactly one Solid runtime for app and @guiexpert/solid-table
  server: { fs: { allow: ["../.."] } }
});
