import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  buildPreviewDocument,
  clearPlaygroundDraft,
  createPlaygroundDraft,
  createPlaygroundShareHash,
  decodePlaygroundShareHash,
  defaultPlaygroundExample,
  encodePlaygroundSharePayload,
  formatConsoleEntry,
  MAX_PLAYGROUND_SOURCE_FIELD_LENGTH,
  MAX_CONSOLE_ENTRIES_PER_RUN,
  MAX_CONSOLE_VALUE_LENGTH,
  MAX_CONSOLE_VALUES_PER_MESSAGE,
  parsePlaygroundMessage,
  parsePlaygroundDraft,
  parsePlaygroundSharePayload,
  PLAYGROUND_MESSAGE_SOURCE,
  PLAYGROUND_DRAFT_STORAGE_KEY,
  PLAYGROUND_SCHEMA_VERSION,
  playgroundTemplates,
  playgroundPreviewCsp,
  readPlaygroundDraft,
  savePlaygroundDraft,
  serializeConsoleValue,
} from "../features/playground";
import type { PlaygroundConsoleEntry, PlaygroundSource } from "../features/playground";
import { primaryNavigation } from "../lib/navigation";
import { platformPillars } from "../features/home/content";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const playgroundFiles = [
  "app/playground/page.tsx",
  "features/playground/types.ts",
  "features/playground/build-preview-document.ts",
  "features/playground/data/default-example.ts",
  "features/playground/constants.ts",
  "features/playground/templates/playground-template.ts",
  "features/playground/templates/templates.ts",
  "features/playground/templates/index.ts",
  "features/playground/persistence/playground-draft.ts",
  "features/playground/persistence/index.ts",
  "features/playground/sharing/share-payload.ts",
  "features/playground/sharing/share-codec.ts",
  "features/playground/sharing/index.ts",
  "features/playground/components/code-editor-panel.tsx",
  "features/playground/components/console-panel.tsx",
  "features/playground/components/playground-toolbar.tsx",
  "features/playground/components/template-selector.tsx",
  "features/playground/components/draft-status.tsx",
  "features/playground/components/share-controls.tsx",
  "features/playground/components/preview-frame.tsx",
  "features/playground/components/playground-workspace.tsx",
  "features/playground/console/format-console-entry.ts",
  "features/playground/console/message-contract.ts",
  "features/playground/console/message-guard.ts",
  "features/playground/console/serialize-console-value.ts",
  "features/playground/index.ts",
  "features/playground/README.md",
  "styles/playground.css",
];

interface MonitorMessage {
  readonly type: string;
  readonly level?: string;
  readonly values?: readonly string[];
}

function runPreviewMonitor(document: string) {
  const monitoringScript = document.match(/<script>([\s\S]*?)<\/script>/)?.[1];

  if (!monitoringScript) {
    throw new Error("Preview document did not contain a monitoring script.");
  }

  const messages: MonitorMessage[] = [];
  const monitorConsole: Record<"error" | "info" | "log" | "warn", (...values: unknown[]) => void> = {
    error: () => undefined,
    info: () => undefined,
    log: () => undefined,
    warn: () => undefined,
  };
  const context = createContext({
    console: monitorConsole,
    document: { readyState: "complete" },
    parent: {
      postMessage: (message: MonitorMessage) => messages.push(message),
    },
    window: {
      addEventListener: () => undefined,
    },
  });

  runInContext(monitoringScript, context);

  return { messages, monitorConsole };
}

describe("Playground foundation", () => {
  it("keeps the Playground module, route, and namespaced styles", () => {
    for (const filePath of playgroundFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );
    const styles = readFileSync(path.join(projectRoot, "styles/playground.css"), "utf8");

    expect(globalStyles).toContain('@import "../styles/playground.css"');
    expect(styles).toContain(".playground-");
    expect(styles).toContain("var(--wc-");
    expect(styles).not.toMatch(/crystal/i);
  });

  it("keeps the standard source contract and safe, complete default example", () => {
    const source: PlaygroundSource = defaultPlaygroundExample;

    expect(source).toMatchObject({
      html: expect.any(String),
      css: expect.any(String),
      javascript: expect.any(String),
    });
    expect(source.html).toContain("button");
    expect(source.css).not.toMatch(/https?:\/\//i);
    expect(source.javascript).toContain("addEventListener");
    expect(source.javascript).not.toMatch(/fetch\s*\(|XMLHttpRequest|WebSocket/i);
  });

  it("builds an isolated preview document with monitoring before safely escaped user code", () => {
    const source: PlaygroundSource = {
      html: '<main id="preview-marker">Preview</main>',
      css: "main { color: rebeccapurple; }",
      javascript: 'const closingTag = "</script>";',
    };
    const before = { ...source };
    const document = buildPreviewDocument(source, "current-run");

    expect(source).toEqual(before);
    expect(document).toContain('http-equiv="Content-Security-Policy"');
    expect(document).toContain(source.html);
    expect(document).toContain(source.css);
    expect(document).toContain('const closingTag = "<\\/script>";');
    expect(document).toContain(PLAYGROUND_MESSAGE_SOURCE);
    expect(document).toContain('const runId = "current-run"');
    expect(document).toContain('console[level] = (...values)');
    expect(document).toContain('window.addEventListener("error"');
    expect(document).toContain('window.addEventListener("unhandledrejection"');
    expect(document.indexOf('console[level] = (...values)')).toBeLessThan(
      document.indexOf('const closingTag = "<\\/script>";'),
    );
    expect(document).not.toMatch(/unsafe-eval|new Function|\beval\s*\(/i);
    expect(playgroundPreviewCsp).toContain("default-src 'none'");
    expect(playgroundPreviewCsp).toContain("connect-src 'none'");
    expect(playgroundPreviewCsp).toContain("style-src 'unsafe-inline'");
    expect(playgroundPreviewCsp).toContain("script-src 'unsafe-inline'");
  });

  it("binds a stable serializer name and monitors logs after a function-name rewrite", () => {
    const document = buildPreviewDocument(defaultPlaygroundExample, "minified-run");
    const rewrittenDocument = document.replace(
      "function serializeConsoleValue(",
      "function s(",
    );
    const { messages, monitorConsole } = runPreviewMonitor(rewrittenDocument);
    const circular: { name: string; self?: unknown } = { name: "circular" };
    circular.self = circular;

    expect(document).toContain("const serializeConsoleValue = (function serializeConsoleValue(");

    monitorConsole.log("online test");
    monitorConsole.log("text", 123, { ok: true });
    monitorConsole.warn("warning");
    monitorConsole.error("error");
    monitorConsole.log(["array", { ok: true }], circular);

    const consoleMessages = messages.filter((message) => message.type === "console");
    expect(consoleMessages).toEqual([
      expect.objectContaining({ level: "log", values: ["online test"] }),
      expect.objectContaining({ level: "log", values: ["text", "123", "{ok: true}"] }),
      expect.objectContaining({ level: "warn", values: ["warning"] }),
      expect.objectContaining({ level: "error", values: ["error"] }),
      expect.objectContaining({
        level: "log",
        values: ["[array, {ok: true}]", "{name: circular, self: [Circular]}"],
      }),
    ]);
    expect(messages.some((message) => message.type === "runtime-error")).toBe(false);
  });

  it("keeps monitor serialization failures and output limits contained", () => {
    const { messages, monitorConsole } = runPreviewMonitor(
      buildPreviewDocument(defaultPlaygroundExample, "limits-run"),
    );
    const explosive = {};
    Object.defineProperty(explosive, Symbol.toStringTag, {
      get() {
        throw new Error("serialization failed");
      },
    });

    monitorConsole.log(explosive);
    monitorConsole.log("still monitored", "x".repeat(MAX_CONSOLE_VALUE_LENGTH + 5));
    monitorConsole.log(
      ...Array.from(
        { length: MAX_CONSOLE_VALUES_PER_MESSAGE + 2 },
        (_value, index) => `value-${index}`,
      ),
    );
    for (let index = 0; index < MAX_CONSOLE_ENTRIES_PER_RUN; index += 1) {
      monitorConsole.info(index);
    }

    const consoleMessages = messages.filter((message) => message.type === "console");
    expect(consoleMessages[0]).toMatchObject({ values: ["[Unserializable]"] });
    expect(consoleMessages[1]?.values?.[0]).toBe("still monitored");
    expect(consoleMessages[1]?.values?.[1]).toHaveLength(MAX_CONSOLE_VALUE_LENGTH);
    expect(consoleMessages[2]?.values).toHaveLength(MAX_CONSOLE_VALUES_PER_MESSAGE);
    expect(consoleMessages).toHaveLength(MAX_CONSOLE_ENTRIES_PER_RUN + 1);
    expect(consoleMessages[consoleMessages.length - 1]).toMatchObject({
      level: "warn",
      values: [`Console output truncated after ${MAX_CONSOLE_ENTRIES_PER_RUN} entries.`],
    });
    expect(messages.some((message) => message.type === "runtime-error")).toBe(false);
  });

  it("keeps the iframe sandboxed and limits client state to the workspace", () => {
    const previewFrame = readFileSync(
      path.join(projectRoot, "features/playground/components/preview-frame.tsx"),
      "utf8",
    );
    const workspace = readFileSync(
      path.join(projectRoot, "features/playground/components/playground-workspace.tsx"),
      "utf8",
    );
    const serverFiles = [
      "app/playground/page.tsx",
      "features/playground/components/code-editor-panel.tsx",
      "features/playground/components/console-panel.tsx",
      "features/playground/components/playground-toolbar.tsx",
      "features/playground/components/preview-frame.tsx",
      "features/playground/components/template-selector.tsx",
      "features/playground/components/draft-status.tsx",
      "features/playground/components/share-controls.tsx",
    ];

    expect(previewFrame).toContain('sandbox="allow-scripts"');
    expect(previewFrame).not.toMatch(
      /allow-same-origin|allow-top-navigation|allow-popups|allow-forms|allow-downloads|allow-modals/i,
    );
    expect(previewFrame).toContain("srcDoc={srcDoc}");
    expect(workspace).toContain('"use client"');

    for (const filePath of serverFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toContain('"use client"');
    }
  });

  it("keeps Playground local and free of network, environment, and external persistence access", () => {
    const runtimeFiles = [
      "features/playground/build-preview-document.ts",
      "features/playground/data/default-example.ts",
      "features/playground/console/message-contract.ts",
      "features/playground/console/message-guard.ts",
      "features/playground/templates/templates.ts",
      "features/playground/persistence/playground-draft.ts",
      "features/playground/sharing/share-payload.ts",
      "features/playground/sharing/share-codec.ts",
    ];

    for (const filePath of runtimeFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|WebSocket|process\.env|sessionStorage|indexedDB/i,
      );
    }

    const workspace = readFileSync(
      path.join(projectRoot, "features/playground/components/playground-workspace.tsx"),
      "utf8",
    );
    expect(workspace).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|process\.env|sessionStorage|indexedDB/i);
  });

  it("adds the real Playground navigation and home-pillar route", () => {
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
    ]);
    expect(platformPillars.find((pillar) => pillar.title === "Playground")).toMatchObject({
      href: "/playground",
      status: "Foundation",
    });
  });

  it("accepts only the current iframe run's bounded message contract", () => {
    const validMessage = {
      source: PLAYGROUND_MESSAGE_SOURCE,
      runId: "current-run",
      timestamp: 1_700_000_000_000,
      type: "console",
      level: "warn",
      values: ["A warning", "with a second value"],
    } as const;
    const parsed = parsePlaygroundMessage(validMessage, "current-run");

    expect(parsed).toEqual(validMessage);
    expect(parsed).not.toBe(validMessage);
    expect(parsePlaygroundMessage({ ...validMessage, source: "other" }, "current-run")).toBeNull();
    expect(parsePlaygroundMessage(validMessage, "stale-run")).toBeNull();
    expect(parsePlaygroundMessage({ ...validMessage, type: "unknown" }, "current-run")).toBeNull();
    expect(
      parsePlaygroundMessage(
        { ...validMessage, values: ["x".repeat(MAX_CONSOLE_VALUE_LENGTH + 1)] },
        "current-run",
      ),
    ).toBeNull();
  });

  it("formats already-sanitized console entries without mutating them", () => {
    const entry: PlaygroundConsoleEntry = {
      id: "entry-1",
      kind: "runtime-error",
      level: "error",
      timestamp: 1_700_000_000_000,
      values: ["Error: example failure"],
      stack: "Error: example failure\\n    at preview.js:1:1",
    };
    const before = { ...entry, values: [...entry.values] };

    expect(formatConsoleEntry(entry)).toMatchObject({
      label: "Runtime Error",
      message: "Error: example failure",
      stack: "Error: example failure\\n    at preview.js:1:1",
    });
    expect(entry).toEqual(before);
  });

  it("serializes circular and deep values without mutating their source", () => {
    const circular: { label: string; nested: unknown; self?: unknown } = {
      label: "example",
      nested: { level: { value: "kept bounded" } },
    };
    circular.self = circular;
    const before = { ...circular };
    const limits = {
      maxCollectionItems: 3,
      maxDepth: 4,
      maxStringLength: 32,
    };

    expect(serializeConsoleValue(circular, limits)).toContain("[Circular]");
    expect(serializeConsoleValue("x".repeat(33), limits)).toHaveLength(32);
    expect(circular).toEqual(before);
  });

  it("keeps verified message handling, run isolation, and Console clearing in the workspace", () => {
    const workspace = readFileSync(
      path.join(projectRoot, "features/playground/components/playground-workspace.tsx"),
      "utf8",
    );
    const toolbar = readFileSync(
      path.join(projectRoot, "features/playground/components/playground-toolbar.tsx"),
      "utf8",
    );
    const panel = readFileSync(
      path.join(projectRoot, "features/playground/components/console-panel.tsx"),
      "utf8",
    );
    const clearConsole = workspace
      .split("function clearConsole()", 2)[1]
      ?.split("function loadTemplate()", 2)[0];

    expect(workspace).toContain("event.source !== previewFrameRef.current?.contentWindow");
    expect(workspace).toContain("parsePlaygroundMessage(event.data, currentRunIdRef.current)");
    expect(workspace).toContain("window.removeEventListener(\"message\", receivePreviewMessage)");
    expect(workspace).toContain("MAX_CONSOLE_ENTRIES_PER_RUN");
    expect(workspace).toContain("createRunId()");
    expect(workspace).toContain("startPreview(draft)");
    expect(workspace).toContain("startPreview(defaultSource)");
    expect(clearConsole).toBeDefined();
    expect(clearConsole).not.toMatch(/startPreview|setRunId|setPreviewSource/);
    expect(toolbar).toContain("Clear Console");
    expect(panel).toContain("Clear Console");
    expect(toolbar).toContain("onClick={onClearConsole}");
    expect(panel).toContain("onClick={onClear}");
    expect(panel).toContain("<ol");
    expect(panel).not.toContain("dangerouslySetInnerHTML");
    expect(panel).not.toContain("aria-live");

    const styles = readFileSync(path.join(projectRoot, "styles/playground.css"), "utf8");
    expect(styles).toContain(".playground-workspace__output");
    expect(styles).not.toMatch(/\.playground-preview\s*\{[\s\S]*?position:\s*sticky/);
  });

  it("ships three bounded, original local templates without external resources", () => {
    expect(playgroundTemplates).toHaveLength(3);
    expect(new Set(playgroundTemplates.map((template) => template.id)).size).toBe(3);

    for (const template of playgroundTemplates) {
      expect(template).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        html: expect.any(String),
        css: expect.any(String),
        javascript: expect.any(String),
      });
      expect(template.html.length).toBeLessThanOrEqual(MAX_PLAYGROUND_SOURCE_FIELD_LENGTH);
      expect(template.css.length).toBeLessThanOrEqual(MAX_PLAYGROUND_SOURCE_FIELD_LENGTH);
      expect(template.javascript.length).toBeLessThanOrEqual(MAX_PLAYGROUND_SOURCE_FIELD_LENGTH);
      expect(`${template.html}\n${template.css}\n${template.javascript}`).not.toMatch(
        /https?:\/\/|\bfetch\s*\(|XMLHttpRequest|WebSocket/i,
      );
    }
  });

  it("runs Form Feedback with a local button click instead of form submission", () => {
    const template = playgroundTemplates.find((item) => item.id === "form-feedback");
    if (template === undefined) throw new Error("Form Feedback template is missing.");

    const listeners = new Map<string, () => void>();
    const topic = { value: "<script>alert('safe text')</script>" };
    const message = { textContent: "" };
    const button = {
      addEventListener: (type: string, listener: () => void) => listeners.set(type, listener),
    };
    const context = createContext({
      document: {
        querySelector: (selector: string) => {
          if (selector === "#feedback-button") return button;
          if (selector === "#feedback-topic") return topic;
          if (selector === "#feedback-message") return message;
          return null;
        },
      },
    });

    expect(template.html).toContain('id="feedback-button" type="button"');
    expect(template.html).not.toContain('type="submit"');
    expect(template.javascript).not.toMatch(/addEventListener\("submit"|\.submit\s*\(/);
    expect(template.javascript).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket/);

    runInContext(template.javascript, context);
    expect([...listeners.keys()]).toEqual(["click"]);
    listeners.get("click")?.();

    expect(message.textContent).toBe(
      "Thanks — “<script>alert('safe text')</script>” stays inside the preview.",
    );
  });

  it("validates versioned drafts, uses one dedicated key, and handles storage failures safely", () => {
    const draft = createPlaygroundDraft(defaultPlaygroundExample, 123, "starter");
    expect(draft).toMatchObject({
      kind: "webcraft.playground.draft",
      schemaVersion: PLAYGROUND_SCHEMA_VERSION,
      templateId: "starter",
    });
    expect(parsePlaygroundDraft({ ...draft, html: 1 })).toBeNull();
    expect(parsePlaygroundDraft({ ...draft, html: "x".repeat(MAX_PLAYGROUND_SOURCE_FIELD_LENGTH + 1) })).toBeNull();

    const calls: string[] = [];
    const storage = {
      getItem: (key: string) => (calls.push(`get:${key}`), null),
      setItem: (key: string) => calls.push(`set:${key}`),
      removeItem: (key: string) => calls.push(`remove:${key}`),
    } as unknown as Storage;
    expect(savePlaygroundDraft(storage, defaultPlaygroundExample, 123, "starter")).toEqual({ status: "saved" });
    expect(clearPlaygroundDraft(storage)).toEqual({ status: "cleared" });
    expect(calls).toEqual([`set:${PLAYGROUND_DRAFT_STORAGE_KEY}`, `remove:${PLAYGROUND_DRAFT_STORAGE_KEY}`]);

    const unavailableStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    } as unknown as Storage;
    expect(readPlaygroundDraft(unavailableStorage)).toEqual({ status: "unavailable" });
    expect(savePlaygroundDraft(unavailableStorage, defaultPlaygroundExample, 123)).toEqual({ status: "unavailable" });
  });

  it("encodes, validates, and decodes UTF-8 share payloads without mutation", () => {
    const source: PlaygroundSource = {
      html: "<p>中文 ✨</p>",
      css: "p { white-space: pre-wrap; }",
      javascript: 'console.log("line one\\nline two");',
    };
    const before = { ...source };
    const hash = createPlaygroundShareHash(source);
    expect(hash).toMatch(/^#playground=[A-Za-z0-9_-]+$/);
    expect(decodePlaygroundShareHash(hash ?? "")).toMatchObject(source);
    expect(decodePlaygroundShareHash("#playground=not_valid!")).toBeNull();
    expect(parsePlaygroundSharePayload({ kind: "webcraft.playground.share", schemaVersion: 1, ...source, runId: "no" })).toBeNull();
    expect(encodePlaygroundSharePayload({ kind: "webcraft.playground.share", schemaVersion: 1, ...source })).toBe(hash);
    expect(source).toEqual(before);
  });

  it("keeps sharing and local recovery behind explicit user actions", () => {
    const workspace = readFileSync(
      path.join(projectRoot, "features/playground/components/playground-workspace.tsx"),
      "utf8",
    );
    const templateSelector = readFileSync(
      path.join(projectRoot, "features/playground/components/template-selector.tsx"),
      "utf8",
    );
    const shareControls = readFileSync(
      path.join(projectRoot, "features/playground/components/share-controls.tsx"),
      "utf8",
    );

    expect(templateSelector).toContain("<select");
    expect(templateSelector).toContain("Load template");
    expect(workspace).toContain("window.confirm");
    expect(workspace).toContain("PLAYGROUND_DRAFT_SAVE_DELAY_MS");
    expect(workspace).toContain("decodePlaygroundShareHash(window.location.hash)");
    expect(workspace).toContain("Shared code loaded. Review it and press Run to execute.");
    expect(workspace).toContain("navigator.clipboard.writeText");
    expect(workspace).not.toMatch(/\beval\s*\(|new Function|fetch\s*\(/i);
    expect(shareControls).toContain("Copy share link");
    expect(shareControls).toContain("Clear local draft");
    expect(shareControls).toContain("Share URL (copy manually)");
  });
});
