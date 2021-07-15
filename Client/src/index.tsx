import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "./index.css";
import App from "./App";
import process from "process";

// Don't use sentry in development
if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://296ccbcd5ad844a3a781ac6c9ea07c47@o920715.ingest.sentry.io/5866570",
    integrations: [new Integrations.BrowserTracing()],
    tunnel: "https://localhost:5001/tunnel",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
