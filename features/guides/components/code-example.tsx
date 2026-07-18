import type { CodeExample as CodeExampleType } from "../types";

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
        <span className="guides-code-example__language">{example.language}</span>
      </figcaption>
      <pre>
        <code className={`language-${example.language.toLowerCase()}`}>{example.code}</code>
      </pre>
    </figure>
  );
}
