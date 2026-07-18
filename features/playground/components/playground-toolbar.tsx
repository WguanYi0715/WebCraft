export interface PlaygroundToolbarProps {
  canClearConsole: boolean;
  canReset: boolean;
  canRun: boolean;
  onClearConsole: () => void;
  onReset: () => void;
  onRun: () => void;
  status: string;
}

export function PlaygroundToolbar({
  canClearConsole,
  canReset,
  canRun,
  onClearConsole,
  onReset,
  onRun,
  status,
}: PlaygroundToolbarProps) {
  return (
    <div className="playground-toolbar wc-mist">
      <div className="playground-toolbar__actions">
        <button
          className="playground-toolbar__button"
          disabled={!canRun}
          onClick={onRun}
          type="button"
        >
          Run preview
        </button>
        <button
          className="playground-toolbar__button playground-toolbar__button--secondary"
          disabled={!canReset}
          onClick={onReset}
          type="button"
        >
          Reset example
        </button>
        <button
          className="playground-toolbar__button playground-toolbar__button--secondary"
          disabled={!canClearConsole}
          onClick={onClearConsole}
          type="button"
        >
          Clear Console
        </button>
      </div>
      <p aria-live="polite" className="playground-toolbar__status" role="status">
        {status}
      </p>
    </div>
  );
}
