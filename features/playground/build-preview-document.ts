import {
  MAX_CONSOLE_ENTRIES_PER_RUN,
  MAX_CONSOLE_VALUE_LENGTH,
  MAX_CONSOLE_VALUES_PER_MESSAGE,
  MAX_ERROR_STACK_LENGTH,
  PLAYGROUND_MESSAGE_SOURCE,
} from "./console/message-contract";
import { serializeConsoleValue } from "./console/serialize-console-value";
import type { PlaygroundSource } from "./types";

export const playgroundPreviewCsp = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "script-src 'unsafe-inline'",
  "img-src data: blob:",
  "connect-src 'none'",
  "font-src 'none'",
  "media-src 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

function escapeClosingScriptTag(javascript: string): string {
  return javascript.replace(/<\/script/gi, "<\\/script");
}

function buildMonitoringScript(runId: string): string {
  return `(() => {
  const source = ${JSON.stringify(PLAYGROUND_MESSAGE_SOURCE)};
  const runId = ${JSON.stringify(runId)};
  const maxEntries = ${MAX_CONSOLE_ENTRIES_PER_RUN};
  const maxValueLength = ${MAX_CONSOLE_VALUE_LENGTH};
  const maxValues = ${MAX_CONSOLE_VALUES_PER_MESSAGE};
  const maxStackLength = ${MAX_ERROR_STACK_LENGTH};
  const maxDepth = 4;
  const maxCollectionItems = 20;
  let consoleCount = 0;
  let didReportTruncation = false;

  const truncate = (value, maximum = maxValueLength) =>
    value.length > maximum ? value.slice(0, maximum - 1) + "…" : value;

  const serializeConsoleValue = (${serializeConsoleValue.toString()});
  const serialize = (value) =>
    serializeConsoleValue(value, { maxCollectionItems, maxDepth, maxStringLength: maxValueLength });

  const send = (message) => {
    parent.postMessage({ source, runId, timestamp: Date.now(), ...message }, "*");
  };

  const reportConsole = (level, values) => {
    if (consoleCount >= maxEntries) {
      if (!didReportTruncation) {
        didReportTruncation = true;
        send({ type: "console", level: "warn", values: ["Console output truncated after " + maxEntries + " entries."] });
      }
      return;
    }

    consoleCount += 1;
    send({
      type: "console",
      level,
      values: values.slice(0, maxValues).map((value) => serialize(value)),
    });
  };

  const originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  ["log", "info", "warn", "error"].forEach((level) => {
    console[level] = (...values) => {
      originalConsole[level](...values);
      reportConsole(level, values);
    };
  });

  const getErrorDetails = (value) => {
    try {
      if (value instanceof Error) {
        let stack;
        try {
          stack = typeof value.stack === "string" ? truncate(value.stack, maxStackLength) : undefined;
        } catch {}
        return {
          text: truncate(value.name + ": " + value.message),
          ...(stack === undefined ? {} : { stack }),
        };
      }

      return { text: serialize(value) };
    } catch {
      return { text: "[Unserializable error]" };
    }
  };

  window.addEventListener("error", (event) => {
    const details = event.error instanceof Error
      ? getErrorDetails(event.error)
      : { text: truncate(event.message || "Runtime error") };
    send({ type: "runtime-error", ...details });
  });

  window.addEventListener("unhandledrejection", (event) => {
    send({ type: "unhandled-rejection", ...getErrorDetails(event.reason) });
  });

  const reportReady = () => send({ type: "ready" });
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", reportReady, { once: true });
  } else {
    reportReady();
  }
})();`;
}

/** Builds a self-contained iframe document without executing or mutating its input. */
export function buildPreviewDocument(source: PlaygroundSource, runId = "initial-run"): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="${playgroundPreviewCsp}">
    <style>${source.css}</style>
  </head>
  <body>
    ${source.html}
    <script>${buildMonitoringScript(runId)}</script>
    <script>${escapeClosingScriptTag(source.javascript)}</script>
  </body>
</html>`;
}
