import {
  MAX_PLAYGROUND_SHARE_HASH_LENGTH,
  PLAYGROUND_SHARE_HASH_PREFIX,
} from "../constants";
import {
  createPlaygroundSharePayload,
  parsePlaygroundSharePayload,
} from "./share-payload";
import type { PlaygroundSharePayload } from "./share-payload";
import type { PlaygroundSource } from "../types";

function encodeBase64Url(value: string): string | null {
  try {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) return null;

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function encodePlaygroundSharePayload(payload: PlaygroundSharePayload): string | null {
  const parsed = parsePlaygroundSharePayload(payload);
  if (parsed === null) return null;
  const encoded = encodeBase64Url(JSON.stringify(parsed));
  if (encoded === null) return null;
  const hash = `${PLAYGROUND_SHARE_HASH_PREFIX}${encoded}`;
  return hash.length <= MAX_PLAYGROUND_SHARE_HASH_LENGTH ? hash : null;
}

export function decodePlaygroundShareHash(hash: string): PlaygroundSharePayload | null {
  if (!hash.startsWith(PLAYGROUND_SHARE_HASH_PREFIX)) return null;
  if (hash.length > MAX_PLAYGROUND_SHARE_HASH_LENGTH) return null;
  const decoded = decodeBase64Url(hash.slice(PLAYGROUND_SHARE_HASH_PREFIX.length));
  if (decoded === null) return null;

  try {
    return parsePlaygroundSharePayload(JSON.parse(decoded) as unknown);
  } catch {
    return null;
  }
}

export function createPlaygroundShareHash(source: PlaygroundSource): string | null {
  const payload = createPlaygroundSharePayload(source);
  return payload === null ? null : encodePlaygroundSharePayload(payload);
}
