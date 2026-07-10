import { defineConfig } from "tsup";
import { copyFileSync } from "fs";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      copilotkit: "src/copilotkit.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", /^@copilotkit\//],
    jsx: "automatic",
    onSuccess: async () => {
      copyFileSync("src/styles.css", "dist/styles.css");
    },
  },
]);
