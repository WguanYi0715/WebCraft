import {
  MAX_CONSOLE_VALUE_LENGTH,
  MAX_CONSOLE_VALUES_PER_MESSAGE,
  MAX_ERROR_STACK_LENGTH,
  PLAYGROUND_MESSAGE_SOURCE,
  playgroundConsoleLevels,
  playgroundMessageTypes,
  type PlaygroundIframeMessage,
} from "./message-contract";

const MAX_RUN_ID_LENGTH = 160;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeTimestamp(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isBoundedString(value: unknown, maximumLength: number): value is string {
  return typeof value === "string" && value.length <= maximumLength;
}

function isAllowedConsoleLevel(value: unknown): value is (typeof playgroundConsoleLevels)[number] {
  return typeof value === "string" && playgroundConsoleLevels.includes(value as never);
}

function isAllowedMessageType(value: unknown): value is (typeof playgroundMessageTypes)[number] {
  return typeof value === "string" && playgroundMessageTypes.includes(value as never);
}

interface ValidBaseMessage {
  readonly source: typeof PLAYGROUND_MESSAGE_SOURCE;
  readonly runId: string;
  readonly timestamp: number;
  readonly type: (typeof playgroundMessageTypes)[number];
}

function isValidBaseMessage(
  message: Record<string, unknown>,
  expectedRunId: string,
): message is Record<string, unknown> & ValidBaseMessage {
  return (
    message.source === PLAYGROUND_MESSAGE_SOURCE &&
    message.runId === expectedRunId &&
    isBoundedString(message.runId, MAX_RUN_ID_LENGTH) &&
    isSafeTimestamp(message.timestamp) &&
    isAllowedMessageType(message.type)
  );
}

/**
 * Accepts only the small, serializable message shape produced by the current iframe run.
 * It returns a fresh object so callers never retain a reference to untrusted event data.
 */
export function parsePlaygroundMessage(
  value: unknown,
  expectedRunId: string,
): PlaygroundIframeMessage | null {
  if (!isRecord(value) || !isValidBaseMessage(value, expectedRunId)) {
    return null;
  }

  const base = {
    source: PLAYGROUND_MESSAGE_SOURCE,
    runId: expectedRunId,
    timestamp: value.timestamp,
  } as const;

  if (value.type === "ready") {
    return { ...base, type: "ready" };
  }

  if (value.type === "console") {
    if (
      !isAllowedConsoleLevel(value.level) ||
      !Array.isArray(value.values) ||
      value.values.length > MAX_CONSOLE_VALUES_PER_MESSAGE ||
      !value.values.every((entry) => isBoundedString(entry, MAX_CONSOLE_VALUE_LENGTH))
    ) {
      return null;
    }

    return {
      ...base,
      type: "console",
      level: value.level,
      values: [...value.values],
    };
  }

  if (
    !isBoundedString(value.text, MAX_CONSOLE_VALUE_LENGTH) ||
    (value.stack !== undefined && !isBoundedString(value.stack, MAX_ERROR_STACK_LENGTH))
  ) {
    return null;
  }

  return {
    ...base,
    type: value.type,
    text: value.text,
    ...(value.stack === undefined ? {} : { stack: value.stack }),
  };
}
