import type { RefObject } from "react";

export interface PreviewFrameProps {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  srcDoc: string;
}

export function PreviewFrame({ iframeRef, srcDoc }: PreviewFrameProps) {
  return (
    <section aria-labelledby="playground-preview-title" className="playground-preview wc-glass">
      <div className="playground-preview__header">
        <div>
          <p className="playground-preview__eyebrow">Preview</p>
          <h2 id="playground-preview-title">Isolated browser preview</h2>
        </div>
        <span>Sandboxed</span>
      </div>
      <iframe
        className="playground-preview__frame"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        title="Playground preview"
      />
    </section>
  );
}
