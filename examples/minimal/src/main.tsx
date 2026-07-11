import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Replace "entry" with your workflow's entry agent id (the demo backend serves
// it from `/api/manifest`). `runtimeUrl` in App.tsx points at your CopilotKit
// runtime — see kaboo-runtime + kaboo-workflows-demo/backend for a server.
const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element");

createRoot(container).render(
  <StrictMode>
    <App agent="entry" threadId={crypto.randomUUID()} />
  </StrictMode>,
);
