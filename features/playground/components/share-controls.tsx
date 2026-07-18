export interface ShareControlsProps {
  readonly manualShareUrl: string | null;
  readonly onClearLocalDraft: () => void;
  readonly onCopyShareLink: () => void;
}

export function ShareControls({
  manualShareUrl,
  onClearLocalDraft,
  onCopyShareLink,
}: ShareControlsProps) {
  return (
    <div className="playground-share-controls">
      <div className="playground-share-controls__actions">
        <button className="playground-toolbar__button playground-toolbar__button--secondary" onClick={onCopyShareLink} type="button">
          Copy share link
        </button>
        <button className="playground-toolbar__button playground-toolbar__button--secondary" onClick={onClearLocalDraft} type="button">
          Clear local draft
        </button>
      </div>
      {manualShareUrl === null ? null : (
        <div className="playground-share-controls__fallback">
          <label htmlFor="playground-share-url">Share URL (copy manually)</label>
          <input id="playground-share-url" readOnly type="text" value={manualShareUrl} />
        </div>
      )}
    </div>
  );
}
