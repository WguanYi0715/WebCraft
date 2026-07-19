import type { CodeExample as CodeExampleType } from "../types";
import { CopyCodeButton } from "./copy-code-button";

export interface CodeExampleProps {
  example: CodeExampleType;
}

export function CodeExample({ example }: CodeExampleProps) {
  const titleId = `${example.title.toLowerCase().replaceAll(" ", "-")}-example-title`;

  return (
    <figure aria-labelledby={titleId} className="guides-code-example">
      <figcaption className="guides-code-example__header">
        <div>
          <h3 id={titleId}>{example.title}</h3>
          {example.description ? <p>{example.description}</p> : null}
        </div>
        <div className="guides-code-example__actions">
          <span className="guides-code-example__language">{example.language}</span>
          <CopyCodeButton code={example.code} />
        </div>
      </figcaption>
      <pre>
        <code className={`language-${example.language.toLowerCase()}`}>{example.code}</code>
      </pre>
    </figure>
  );
}
