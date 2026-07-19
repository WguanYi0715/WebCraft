"use client";

import { useEffect, useId, useRef, useState } from "react";

const STATUS_RESET_DELAY_MS = 3_000;

export type CopyCodeStatus = "idle" | "success" | "error";

type ClipboardWriter = Pick<Clipboard, "writeText">;

export interface CopyCodeButtonProps {
  readonly code: string;
}

export async function copyCode(
  code: string,
  clipboard: ClipboardWriter | undefined,
): Promise<Exclude<CopyCodeStatus, "idle">> {
  if (clipboard === undefined || typeof clipboard.writeText !== "function") {
    return "error";
  }

  try {
    await clipboard.writeText(code);
    return "success";
  } catch {
    return "error";
  }
}

function getFeedbackMessage(status: CopyCodeStatus): string {
  if (status === "success") return "Copied";
  if (status === "error") return "Copy failed — select the code manually";

  return "";
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [status, setStatus] = useState<CopyCodeStatus>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackId = useId();

  function clearStatusResetTimer() {
    if (resetTimerRef.current === null) return;

    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = null;
  }

  function scheduleStatusReset() {
    clearStatusResetTimer();
    resetTimerRef.current = setTimeout(() => {
      resetTimerRef.current = null;
      setStatus("idle");
    }, STATUS_RESET_DELAY_MS);
  }

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const clipboard =
      typeof navigator === "undefined" ? undefined : navigator.clipboard;
    const nextStatus = await copyCode(code, clipboard);

    setStatus(nextStatus);
    scheduleStatusReset();
  }

  const feedback = getFeedbackMessage(status);

  return (
    <div className="guides-code-example__copy">
      <button
        aria-describedby={feedback === "" ? undefined : feedbackId}
        className="guides-code-example__copy-button"
        onClick={handleCopy}
        type="button"
      >
        Copy code
      </button>
      <p
        aria-atomic="true"
        aria-live="polite"
        className={`guides-code-example__copy-feedback guides-code-example__copy-feedback--${status}`}
        id={feedbackId}
        role="status"
      >
        {feedback}
      </p>
    </div>
  );
}
