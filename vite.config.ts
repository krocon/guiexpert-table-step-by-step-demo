import { defineConfig } from "vite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// every folder with an index.html is its own page (/, /naive/, /virtual/ …)
const pages = ["index.html", "naive/index.html", "virtual/index.html"]
  .filter(p => existsSync(resolve(__dirname, p)));

export default defineConfig({
  build: { rollupOptions: { input: Object.fromEntries(pages.map(p => [p, resolve(__dirname, p)])) } }
});
