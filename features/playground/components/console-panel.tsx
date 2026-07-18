import { formatConsoleEntry } from "../console/format-console-entry";
import type { PlaygroundConsoleEntry } from "../types";

export interface ConsolePanelProps {
  entries: readonly PlaygroundConsoleEntry[];
  isTruncated: boolean;
  onClear: () => void;
}

export function ConsolePanel({ entries, isTruncated, onClear }: ConsolePanelProps) {
  return (
    <section aria-labelledby="playground-console-title" className="playground-console">
      <div className="playground-console__header">
        <div>
          <p className="playground-console__eyebrow">Console</p>
          <h2 id="playground-console-title">Isolated runtime output</h2>
        </div>
        <span>{entries.length} entries</span>
      </div>
      <div className="playground-console__actions">
        <button
          className="playground-console__clear"
          disabled={entries.length === 0 && !isTruncated}
          onClick={onClear}
          type="button"
        >
          Clear Console
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="playground-console__empty">
          Console output from the current isolated preview will appear here.
        </p>
      ) : (
        <ol className="playground-console__list">
          {entries.map((entry) => {
            const formatted = formatConsoleEntry(entry);

            return (
              <li
                className={`playground-console__entry playground-console__entry--${entry.level}`}
                key={entry.id}
              >
                <div className="playground-console__entry-meta">
                  <span>{formatted.label}</span>
                  <time dateTime={new Date(entry.timestamp).toISOString()}>{formatted.time}</time>
                </div>
                <p>{formatted.message}</p>
                {formatted.stack === undefined ? null : (
                  <pre className="playground-console__stack">{formatted.stack}</pre>
                )}
              </li>
            );
          })}
        </ol>
      )}
      {isTruncated ? (
        <p className="playground-console__truncated" role="note">
          Console truncated after 200 entries for this run.
        </p>
      ) : null}
    </section>
  );
}
