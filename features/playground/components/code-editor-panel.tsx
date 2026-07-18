import type { ChangeEvent } from "react";
import type { PlaygroundLanguage } from "../types";

export interface CodeEditorPanelProps {
  id: string;
  label: string;
  language: PlaygroundLanguage;
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditorPanel({
  id,
  label,
  language,
  value,
  onChange,
}: CodeEditorPanelProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <section aria-labelledby={`${id}-label`} className="playground-editor">
      <div className="playground-editor__header">
        <label htmlFor={id} id={`${id}-label`}>
          {label}
        </label>
        <span>{language}</span>
      </div>
      <textarea
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="playground-editor__textarea"
        id={id}
        onChange={handleChange}
        spellCheck={false}
        value={value}
      />
    </section>
  );
}
