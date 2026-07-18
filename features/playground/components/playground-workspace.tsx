"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildPreviewDocument } from "../build-preview-document";
import { PLAYGROUND_DRAFT_SAVE_DELAY_MS, PLAYGROUND_SHARE_HASH_PREFIX } from "../constants";
import { MAX_CONSOLE_ENTRIES_PER_RUN } from "../console/message-contract";
import { parsePlaygroundMessage } from "../console/message-guard";
import { defaultPlaygroundExample } from "../data/default-example";
import {
  clearPlaygroundDraft,
  readPlaygroundDraft,
  savePlaygroundDraft,
} from "../persistence";
import { createPlaygroundShareHash, decodePlaygroundShareHash } from "../sharing";
import { playgroundTemplates } from "../templates";
import type {
  PlaygroundConsoleEntry,
  PlaygroundLanguage,
  PlaygroundSource,
} from "../types";
import { CodeEditorPanel } from "./code-editor-panel";
import { ConsolePanel } from "./console-panel";
import { DraftStatus } from "./draft-status";
import { PlaygroundToolbar } from "./playground-toolbar";
import { PreviewFrame } from "./preview-frame";
import { ShareControls } from "./share-controls";
import { TemplateSelector } from "./template-selector";

const initialRunId = "initial-playground-run";

function createRunId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `playground-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function copySource(source: PlaygroundSource): PlaygroundSource {
  return { ...source };
}

function sourceKey(source: PlaygroundSource, templateId?: string): string {
  return JSON.stringify([source.html, source.css, source.javascript, templateId ?? null]);
}

function sourcesMatch(left: PlaygroundSource, right: PlaygroundSource): boolean {
  return left.html === right.html && left.css === right.css && left.javascript === right.javascript;
}

function getLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function PlaygroundWorkspace() {
  const [draft, setDraft] = useState<PlaygroundSource>(() => copySource(defaultPlaygroundExample));
  const [previewSource, setPreviewSource] = useState<PlaygroundSource>(() =>
    copySource(defaultPlaygroundExample),
  );
  const [runId, setRunId] = useState(initialRunId);
  const [consoleEntries, setConsoleEntries] = useState<readonly PlaygroundConsoleEntry[]>([]);
  const [isConsoleTruncated, setIsConsoleTruncated] = useState(false);
  const [status, setStatus] = useState("Default preview ready.");
  const [selectedTemplateId, setSelectedTemplateId] = useState("starter");
  const [templateId, setTemplateId] = useState<string | undefined>("starter");
  const [draftStatus, setDraftStatus] = useState("Local draft is ready to save in this browser.");
  const [draftStatusTone, setDraftStatusTone] = useState<"default" | "error">("default");
  const [notice, setNotice] = useState("");
  const [manualShareUrl, setManualShareUrl] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const currentRunIdRef = useRef(initialRunId);
  const consoleEntryCountRef = useRef(0);
  const isConsoleTruncatedRef = useRef(false);
  const hasRuntimeErrorRef = useRef(false);
  const savedSourceKeyRef = useRef(sourceKey(defaultPlaygroundExample, "starter"));
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewDocument = useMemo(
    () => buildPreviewDocument(previewSource, runId),
    [previewSource, runId],
  );
  const canRun = !sourcesMatch(draft, previewSource);
  const canReset =
    !sourcesMatch(draft, defaultPlaygroundExample) ||
    !sourcesMatch(previewSource, defaultPlaygroundExample);

  useEffect(() => {
    function receivePreviewMessage(event: MessageEvent<unknown>) {
      if (event.source !== previewFrameRef.current?.contentWindow) return;

      const message = parsePlaygroundMessage(event.data, currentRunIdRef.current);
      if (message === null) return;

      if (message.type === "ready") {
        setStatus(
          hasRuntimeErrorRef.current
            ? "Runtime error occurred."
            : isConsoleTruncatedRef.current
              ? "Console truncated."
              : "Preview ready.",
        );
        return;
      }

      const entry: PlaygroundConsoleEntry =
        message.type === "console"
          ? {
              id: `${message.runId}-${message.timestamp}-${consoleEntryCountRef.current}`,
              kind: "console",
              level: message.level,
              timestamp: message.timestamp,
              values: message.values,
            }
          : {
              id: `${message.runId}-${message.timestamp}-${consoleEntryCountRef.current}`,
              kind: message.type,
              level: "error",
              timestamp: message.timestamp,
              values: [message.text],
              ...(message.stack === undefined ? {} : { stack: message.stack }),
            };

      if (consoleEntryCountRef.current >= MAX_CONSOLE_ENTRIES_PER_RUN) {
        isConsoleTruncatedRef.current = true;
        setIsConsoleTruncated(true);
        setStatus("Console truncated.");
        return;
      }

      consoleEntryCountRef.current += 1;
      setConsoleEntries((current) => [...current, entry]);
      if (message.type === "runtime-error" || message.type === "unhandled-rejection") {
        hasRuntimeErrorRef.current = true;
        setStatus("Runtime error occurred.");
      }
    }

    window.addEventListener("message", receivePreviewMessage);
    return () => window.removeEventListener("message", receivePreviewMessage);
  }, []);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const shared = decodePlaygroundShareHash(window.location.hash);
      const hasShareHash = window.location.hash.startsWith(PLAYGROUND_SHARE_HASH_PREFIX);

      if (shared !== null) {
        const nextSource = copySource(shared);
        setDraft(nextSource);
        setTemplateId(undefined);
        setSelectedTemplateId("starter");
        savedSourceKeyRef.current = sourceKey(nextSource);
        setDraftStatus("Shared code is open locally. Edit it to save a local draft.");
        setNotice("Shared code loaded. Review it and press Run to execute.");
        setIsInitialized(true);
        return;
      }

      const storage = getLocalStorage();
      const result = storage === null ? { status: "unavailable" as const } : readPlaygroundDraft(storage);
      if (result.status === "restored") {
        const nextSource = copySource(result.draft);
        setDraft(nextSource);
        setTemplateId(result.draft.templateId);
        setSelectedTemplateId(
          playgroundTemplates.some((template) => template.id === result.draft.templateId)
            ? result.draft.templateId ?? "starter"
            : "starter",
        );
        savedSourceKeyRef.current = sourceKey(nextSource, result.draft.templateId);
        setDraftStatus("Local draft restored. Review the code, then press Run to execute.");
        setNotice(hasShareHash ? "Invalid or unsupported share link" : "Local draft restored.");
      } else if (result.status === "invalid") {
        setDraftStatus("Invalid local draft was ignored.");
        setDraftStatusTone("error");
        setNotice(hasShareHash ? "Invalid or unsupported share link" : "Invalid local draft was ignored.");
      } else if (result.status === "unavailable") {
        setDraftStatus("Local storage is unavailable. Changes will not be saved.");
        setDraftStatusTone("error");
        if (hasShareHash) setNotice("Invalid or unsupported share link");
      } else if (hasShareHash) {
        setNotice("Invalid or unsupported share link");
      }
      setIsInitialized(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const nextKey = sourceKey(draft, templateId);
    if (nextKey === savedSourceKeyRef.current) return;

    setDraftStatus("Saving locally…");
    setDraftStatusTone("default");
    saveTimerRef.current = setTimeout(() => {
      const storage = getLocalStorage();
      const result =
        storage === null
          ? { status: "unavailable" as const }
          : savePlaygroundDraft(storage, draft, Date.now(), templateId);
      if (result.status === "saved") {
        savedSourceKeyRef.current = nextKey;
        setDraftStatus("Saved locally");
      } else {
        setDraftStatus(
          result.status === "invalid"
            ? "Draft is too large to save locally."
            : "Local storage is unavailable. Changes were not saved.",
        );
        setDraftStatusTone("error");
      }
    }, PLAYGROUND_DRAFT_SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    };
  }, [draft, isInitialized, templateId]);

  function updateDraft(language: PlaygroundLanguage, value: string) {
    setManualShareUrl(null);
    setDraft((current) => ({ ...current, [language]: value }));
  }

  function startPreview(source: PlaygroundSource) {
    const nextRunId = createRunId();
    currentRunIdRef.current = nextRunId;
    consoleEntryCountRef.current = 0;
    isConsoleTruncatedRef.current = false;
    hasRuntimeErrorRef.current = false;
    setConsoleEntries([]);
    setIsConsoleTruncated(false);
    setRunId(nextRunId);
    setPreviewSource(copySource(source));
    setStatus("Updating preview.");
  }

  function persistImmediately(source: PlaygroundSource, nextTemplateId?: string) {
    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    const storage = getLocalStorage();
    const result =
      storage === null
        ? { status: "unavailable" as const }
        : savePlaygroundDraft(storage, source, Date.now(), nextTemplateId);
    if (result.status === "saved") {
      savedSourceKeyRef.current = sourceKey(source, nextTemplateId);
      setDraftStatus("Saved locally");
      setDraftStatusTone("default");
    } else {
      setDraftStatus(
        result.status === "invalid"
          ? "Draft is too large to save locally."
          : "Local storage is unavailable. Changes were not saved.",
      );
      setDraftStatusTone("error");
    }
  }

  function runPreview() {
    startPreview(draft);
  }

  function resetExample() {
    const defaultSource = copySource(defaultPlaygroundExample);
    setDraft(defaultSource);
    setTemplateId("starter");
    setSelectedTemplateId("starter");
    setManualShareUrl(null);
    startPreview(defaultSource);
    setNotice("Starter example restored.");
  }

  function clearConsole() {
    consoleEntryCountRef.current = 0;
    isConsoleTruncatedRef.current = false;
    setConsoleEntries([]);
    setIsConsoleTruncated(false);
    setStatus("Console cleared.");
  }

  function loadTemplate() {
    const template = playgroundTemplates.find((item) => item.id === selectedTemplateId);
    if (template === undefined) return;
    if (
      sourceKey(draft, templateId) !== savedSourceKeyRef.current &&
      !window.confirm("Load this template and replace the current unsaved editor content?")
    ) {
      return;
    }

    const nextSource = copySource(template);
    setDraft(nextSource);
    setTemplateId(template.id);
    setManualShareUrl(null);
    startPreview(nextSource);
    persistImmediately(nextSource, template.id);
    setNotice(`${template.name} loaded, preview updated, and saved locally.`);
  }

  function clearLocalDraft() {
    if (!window.confirm("Clear only this Playground local draft? Current editor code will remain open.")) {
      return;
    }

    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    const storage = getLocalStorage();
    const result = storage === null ? { status: "unavailable" as const } : clearPlaygroundDraft(storage);
    if (result.status === "cleared") {
      savedSourceKeyRef.current = sourceKey(draft, templateId);
      setDraftStatus("Local draft cleared. Current code remains open.");
      setDraftStatusTone("default");
      setNotice("Local draft cleared. Refreshing will not restore the current code.");
    } else {
      setDraftStatus("Local storage is unavailable. The draft could not be cleared.");
      setDraftStatusTone("error");
      setNotice("Local draft could not be cleared.");
    }
  }

  async function copyShareLink() {
    const hash = createPlaygroundShareHash(draft);
    if (hash === null) {
      setManualShareUrl(null);
      setNotice("This example is too large for a safe share link. Shorten the example and try again.");
      return;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;
    try {
      if (navigator.clipboard === undefined) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
      setManualShareUrl(null);
      setNotice("Share link copied.");
    } catch {
      setManualShareUrl(shareUrl);
      setNotice("Clipboard access failed. Copy the share URL manually.");
    }
  }

  return (
    <div className="playground-workspace">
      <PlaygroundToolbar
        canClearConsole={consoleEntries.length > 0 || isConsoleTruncated}
        canReset={canReset}
        canRun={canRun}
        onClearConsole={clearConsole}
        onReset={resetExample}
        onRun={runPreview}
        status={status}
      />
      <section aria-label="Playground templates and local controls" className="playground-local-controls wc-mist">
        <TemplateSelector
          onLoadTemplate={loadTemplate}
          onSelectedTemplateChange={setSelectedTemplateId}
          selectedTemplateId={selectedTemplateId}
          templates={playgroundTemplates}
        />
        <DraftStatus message={draftStatus} tone={draftStatusTone} />
        <ShareControls
          manualShareUrl={manualShareUrl}
          onClearLocalDraft={clearLocalDraft}
          onCopyShareLink={copyShareLink}
        />
        <p className="playground-local-controls__safety">
          Drafts stay in this browser. Share links contain complete source code, so never put passwords, tokens, or private data in an example. Shared code does not run automatically.
        </p>
      </section>
      {notice === "" ? null : <p aria-live="polite" className="playground-notice" role="status">{notice}</p>}
      <div className="playground-workspace__main">
        <div className="playground-workspace__editors">
          <CodeEditorPanel id="playground-html" label="HTML" language="html" onChange={(value) => updateDraft("html", value)} value={draft.html} />
          <CodeEditorPanel id="playground-css" label="CSS" language="css" onChange={(value) => updateDraft("css", value)} value={draft.css} />
          <CodeEditorPanel id="playground-javascript" label="JavaScript" language="javascript" onChange={(value) => updateDraft("javascript", value)} value={draft.javascript} />
        </div>
        <div className="playground-workspace__output">
          <PreviewFrame iframeRef={previewFrameRef} srcDoc={previewDocument} />
          <ConsolePanel entries={consoleEntries} isTruncated={isConsoleTruncated} onClear={clearConsole} />
        </div>
      </div>
    </div>
  );
}
