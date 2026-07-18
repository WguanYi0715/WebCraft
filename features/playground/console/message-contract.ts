import type { PlaygroundConsoleLevel } from "../types";

export const PLAYGROUND_MESSAGE_SOURCE = "webcraft-playground" as const;

export const playgroundMessageTypes = [
  "ready",
  "console",
  "runtime-error",
  "unhandled-rejection",
] as const;

export type PlaygroundMessageType = (typeof playgroundMessageTypes)[number];

export const playgroundConsoleLevels = ["log", "info", "warn", "error"] as const;

export const MAX_CONSOLE_ENTRIES_PER_RUN = 200;
export const MAX_CONSOLE_VALUE_LENGTH = 2_000;
export const MAX_ERROR_STACK_LENGTH = 4_000;
export const MAX_CONSOLE_VALUES_PER_MESSAGE = 12;

interface PlaygroundMessageBase {
  readonly source: typeof PLAYGROUND_MESSAGE_SOURCE;
  readonly runId: string;
  readonly timestamp: number;
}

export interface PlaygroundReadyMessage extends PlaygroundMessageBase {
  readonly type: "ready";
}

export interface PlaygroundConsoleMessage extends PlaygroundMessageBase {
  readonly type: "console";
  readonly level: PlaygroundConsoleLevel;
  readonly values: readonly string[];
}

export interface PlaygroundRuntimeErrorMessage extends PlaygroundMessageBase {
  readonly type: "runtime-error" | "unhandled-rejection";
  readonly text: string;
  readonly stack?: string;
}

export type PlaygroundIframeMessage =
  | PlaygroundReadyMessage
  | PlaygroundConsoleMessage
  | PlaygroundRuntimeErrorMessage;
