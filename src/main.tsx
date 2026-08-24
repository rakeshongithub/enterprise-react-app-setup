import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { bootstrap } from "./app/bootstrap";
import { enableMocking } from "./mocks";

async function start() {
  // Enable MSW mocking in development mode
  await enableMocking();

  await bootstrap();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

await start();
