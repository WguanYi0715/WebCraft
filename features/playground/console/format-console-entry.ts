import type { PlaygroundConsoleEntry } from "../types";

export interface FormattedConsoleEntry {
  readonly label: string;
  readonly message: string;
  readonly time: string;
  readonly stack?: string;
}

const levelLabels = {
  log: "Log",
  info: "Info",
  warn: "Warning",
  error: "Error",
} as const;

/** Formats already-sanitized entry data for structured React output. */
export function formatConsoleEntry(entry: PlaygroundConsoleEntry): FormattedConsoleEntry {
  const label =
    entry.kind === "runtime-error"
      ? "Runtime Error"
      : entry.kind === "unhandled-rejection"
        ? "Unhandled Rejection"
        : levelLabels[entry.level];

  return {
    label,
    message: entry.values.join(" "),
    time: new Date(entry.timestamp).toISOString().slice(11, 19),
    ...(entry.stack === undefined ? {} : { stack: entry.stack }),
  };
}
