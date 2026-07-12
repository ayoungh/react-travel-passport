import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: "demo",
  plugins: [react()],
  resolve: {
    alias: {
      "react-travel-passport/styles.css": fileURLToPath(
        new URL("./src/styles.css", import.meta.url),
      ),
      "react-travel-passport": fileURLToPath(
        new URL("./src/index.ts", import.meta.url),
      ),
    },
  },
});
