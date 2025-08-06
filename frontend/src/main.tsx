import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App.tsx";
import initWasm from "@wasm/reedfrost";

import "@/main.css";

initWasm()
  .then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  })
  .catch((err: Error) => {
    console.error("Failed to initialize WASM:", err);
  });
