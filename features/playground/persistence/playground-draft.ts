import {
  MAX_PLAYGROUND_SOURCE_FIELD_LENGTH,
  MAX_PLAYGROUND_SOURCE_TOTAL_LENGTH,
  PLAYGROUND_DRAFT_KIND,
  PLAYGROUND_DRAFT_STORAGE_KEY,
  PLAYGROUND_SCHEMA_VERSION,
} from "../constants";
import type { PlaygroundSource } from "../types";

export interface PlaygroundDraft extends PlaygroundSource {
  readonly kind: typeof PLAYGROUND_DRAFT_KIND;
  readonly schemaVersion: typeof PLAYGROUND_SCHEMA_VERSION;
  readonly updatedAt: number;
  readonly templateId?: string;
}

export type PlaygroundDraftReadResult =
  | { readonly status: "missing" }
  | { readonly status: "restored"; readonly draft: PlaygroundDraft }
  | { readonly status: "invalid" }
  | { readonly status: "unavailable" };

export type PlaygroundDraftWriteResult =
  | { readonly status: "saved" }
  | { readonly status: "cleared" }
  | { readonly status: "invalid" }
  | { readonly status: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPlaygroundSource(value: unknown): value is PlaygroundSource {
  if (!isRecord(value)) return false;

  const { html, css, javascript } = value;
  if (typeof html !== "string" || typeof css !== "string" || typeof javascript !== "string") {
    return false;
  }

  return (
    html.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    css.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    javascript.length <= MAX_PLAYGROUND_SOURCE_FIELD_LENGTH &&
    html.length + css.length + javascript.length <= MAX_PLAYGROUND_SOURCE_TOTAL_LENGTH
  );
}

export function parsePlaygroundDraft(value: unknown): PlaygroundDraft | null {
  if (!isRecord(value)) return null;

  const allowedKeys = new Set([
    "kind",
    "schemaVersion",
    "html",
    "css",
    "javascript",
    "updatedAt",
    "templateId",
  ]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) return null;
  if (
    value.kind !== PLAYGROUND_DRAFT_KIND ||
    value.schemaVersion !== PLAYGROUND_SCHEMA_VERSION ||
    typeof value.updatedAt !== "number" ||
    !Number.isFinite(value.updatedAt) ||
    (value.templateId !== undefined && typeof value.templateId !== "string")
  ) {
    return null;
  }
  if (typeof value.templateId === "string" && value.templateId.length > 80) return null;
  if (!isPlaygroundSource(value)) return null;

  return {
    kind: PLAYGROUND_DRAFT_KIND,
    schemaVersion: PLAYGROUND_SCHEMA_VERSION,
    html: value.html,
    css: value.css,
    javascript: value.javascript,
    updatedAt: value.updatedAt,
    ...(typeof value.templateId === "string" ? { templateId: value.templateId } : {}),
  };
}

export function createPlaygroundDraft(
  source: PlaygroundSource,
  updatedAt: number,
  templateId?: string,
): PlaygroundDraft | null {
  if (!isPlaygroundSource(source) || !Number.isFinite(updatedAt)) return null;
  if (templateId !== undefined && (templateId.length === 0 || templateId.length > 80)) return null;

  return {
    kind: PLAYGROUND_DRAFT_KIND,
    schemaVersion: PLAYGROUND_SCHEMA_VERSION,
    html: source.html,
    css: source.css,
    javascript: source.javascript,
    updatedAt,
    ...(templateId === undefined ? {} : { templateId }),
  };
}

export function readPlaygroundDraft(storage: Storage): PlaygroundDraftReadResult {
  try {
    const raw = storage.getItem(PLAYGROUND_DRAFT_STORAGE_KEY);
    if (raw === null) return { status: "missing" };

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      storage.removeItem(PLAYGROUND_DRAFT_STORAGE_KEY);
      return { status: "invalid" };
    }

    const draft = parsePlaygroundDraft(parsed);
    if (draft === null) {
      storage.removeItem(PLAYGROUND_DRAFT_STORAGE_KEY);
      return { status: "invalid" };
    }

    return { status: "restored", draft };
  } catch {
    return { status: "unavailable" };
  }
}

export function savePlaygroundDraft(
  storage: Storage,
  source: PlaygroundSource,
  updatedAt: number,
  templateId?: string,
): PlaygroundDraftWriteResult {
  const draft = createPlaygroundDraft(source, updatedAt, templateId);
  if (draft === null) return { status: "invalid" };

  try {
    storage.setItem(PLAYGROUND_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return { status: "saved" };
  } catch {
    return { status: "unavailable" };
  }
}

export function clearPlaygroundDraft(storage: Storage): PlaygroundDraftWriteResult {
  try {
    storage.removeItem(PLAYGROUND_DRAFT_STORAGE_KEY);
    return { status: "cleared" };
  } catch {
    return { status: "unavailable" };
  }
}
