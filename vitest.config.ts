import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    server: {
      // Force Vite to transform @copilotkit so its `import "./index.css"` is
      // handled (Node's ESM loader rejects the .css extension otherwise).
      deps: { inline: [/@copilotkit\/react-core/] },
    },
  },
});
