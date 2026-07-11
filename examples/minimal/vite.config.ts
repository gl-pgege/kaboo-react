import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy CopilotKit runtime calls to your backend (e.g. a kaboo-runtime
    // powered CopilotKit runtime). Adjust the target to match your server.
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
