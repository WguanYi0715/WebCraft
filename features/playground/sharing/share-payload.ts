import {
  MAX_PLAYGROUND_SOURCE_FIELD_LENGTH,
  MAX_PLAYGROUND_SOURCE_TOTAL_LENGTH,
  PLAYGROUND_SCHEMA_VERSION,
  PLAYGROUND_SHARE_KIND,
} from "../constants";
import type { PlaygroundSource } from "../types";

export interface PlaygroundSharePayload extends PlaygroundSource {
  readonly kind: typeof PLAYGROUND_SHARE_KIND;
  readonly schemaVersion: typeof PLAYGROUND_SCHEMA_VERSION;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidShareSource(value: unknown): value is PlaygroundSource {
  if (!isRecord(value)) return false;
  const { html, css, javascript } = value;
  return (
    typeof html === "string" &&
    typeof css === "string" &&
    typeof javascript === "string" &&
    html.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    css.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    javascript.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    html.length + css.length + javascript.length <= MAX_PLAYGROUND_SOURCE_TOTAL_LENGTH
  );
}

export function parsePlaygroundSharePayload(value: unknown): PlaygroundSharePayload | null {
  if (!isRecord(value)) return null;
  const allowedKeys = new Set(["kind", "schemaVersion", "html", "css", "javascript"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;
  if (value.kind !== PLAYGROUND_SHARE_KIND || value.schemaVersion !== PLAYGROUND_SCHEMA_VERSION) {
    return null;
  }
  if (!isValidShareSource(value)) return null;

  return {
    kind: PLAYGROUND_SHARE_KIND,
    schemaVersion: PLAYGROUND_SCHEMA_VERSION,
    html: value.html,
    css: value.css,
    javascript: value.javascript,
  };
}

export function createPlaygroundSharePayload(
  source: PlaygroundSource,
): PlaygroundSharePayload | null {
  if (!isValidShareSource(source)) return null;

  return {
    kind: PLAYGROUND_SHARE_KIND,
    schemaVersion: PLAYGROUND_SCHEMA_VERSION,
    html: source.html,
    css: source.css,
    javascript: source.javascript,
  };
}
