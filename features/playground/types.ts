export interface PlaygroundSource {
  readonly html: string;
  readonly css: string;
  readonly javascript: string;
}

export type PlaygroundLanguage = keyof PlaygroundSource;

export type PlaygroundConsoleLevel = "log" | "info" | "warn" | "error";

export type PlaygroundConsoleEntryKind =
  | "console"
  | "runtime-error"
  | "unhandled-rejection";

export interface PlaygroundConsoleEntry {
  readonly id: string;
  readonly kind: PlaygroundConsoleEntryKind;
  readonly level: PlaygroundConsoleLevel;
  readonly timestamp: number;
  readonly values: readonly string[];
  readonly stack?: string;
}
