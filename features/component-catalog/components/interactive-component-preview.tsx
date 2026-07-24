"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { CopyCodeButton } from "@/features/guides/components/copy-code-button";
import type {
  InteractiveComponentDefinition,
  InteractiveComponentSlug,
} from "../data/interactive-components";

type PreviewState = string;

export interface InteractiveComponentPreviewProps {
  definition: InteractiveComponentDefinition;
}

function StateSelector({
  name,
  states,
  value,
  onChange,
}: {
  name: string;
  states: readonly string[];
  value: PreviewState;
  onChange: (state: PreviewState) => void;
}) {
  return (
    <div className="component-showcase-state-selector">
      <p className="component-showcase-state-selector__label">Preview preset</p>
      <div aria-label={`${name} preview preset`} className="component-showcase-state-selector__options" role="group">
        {states.map((state) => (
          <button
            aria-pressed={value === state}
            className="component-showcase-state-selector__button"
            key={state}
            onClick={() => onChange(state)}
            type="button"
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
}

function CodeDisclosure({ code, name }: { code: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const codeId = useId();

  return (
    <section className="component-showcase-code" aria-label={`${name} code example`}>
      <div className="component-showcase-code__toolbar">
        <button
          aria-controls={codeId}
          aria-expanded={isOpen}
          className="component-showcase-code__toggle"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? "Hide code" : "View code"}
        </button>
        {isOpen ? <CopyCodeButton code={code} /> : null}
      </div>
      {isOpen ? (
        <pre className="component-showcase-code__block" id={codeId}>
          <code>{code}</code>
        </pre>
      ) : null}
    </section>
  );
}

function ButtonPreview({ state }: { state: PreviewState }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activationCount, setActivationCount] = useState(0);
  const loading = state === "Loading";
  const disabled = state === "Disabled";

  useEffect(() => {
    if (state === "Focus") buttonRef.current?.focus();
  }, [state]);

  return (
    <div className={`component-showcase-preview component-showcase-preview--button${state === "Hover" ? " is-hover-preview" : ""}`}>
      <Button
        aria-label="Save component changes"
        disabled={disabled}
        loading={loading}
        onClick={() => setActivationCount((count) => count + 1)}
        ref={buttonRef}
      >
        {loading ? "Saving" : disabled ? "Unavailable" : "Save changes"}
      </Button>
      <p className="component-showcase-preview__status" role="status">
        {loading ? "Saving changes" : disabled ? "Action unavailable" : `Activated ${activationCount} times`}
      </p>
    </div>
  );
}

function FormFieldPreview({ state }: { state: PreviewState }) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(state === "Filled" ? "Component catalog" : "");
  const error = state === "Error";
  const disabled = state === "Disabled";

  useEffect(() => {
    if (state === "Focus") inputRef.current?.focus();
  }, [state]);

  return (
    <div className="component-showcase-preview component-showcase-preview--field">
      <label htmlFor={inputId}>Project name</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        id={inputId}
        name="project-name"
        onChange={(event) => setValue(event.target.value)}
        ref={inputRef}
        type="text"
        value={value}
      />
      {error ? (
        <p className="component-showcase-preview__error" id={errorId} role="alert">
          Choose a name with at least 3 characters.
        </p>
      ) : (
        <p className="component-showcase-preview__hint">Use a short, recognisable project label.</p>
      )}
    </div>
  );
}

function SwitchPreview({ state }: { state: PreviewState }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(state === "On");
  const disabled = state === "Disabled";

  useEffect(() => {
    if (state === "Focus") inputRef.current?.focus();
  }, [state]);

  return (
    <div className="component-showcase-preview component-showcase-preview--switch">
      <label className="component-showcase-switch" htmlFor={inputId}>
        <input
          checked={checked}
          disabled={disabled}
          id={inputId}
          onChange={(event) => setChecked(event.target.checked)}
          ref={inputRef}
          role="switch"
          type="checkbox"
        />
        <span aria-hidden="true" className="component-showcase-switch__track">
          <span className="component-showcase-switch__thumb" />
        </span>
        <span>Compact layout</span>
      </label>
      <p className="component-showcase-preview__status" role="status">
        Compact layout is {checked ? "on" : "off"}{disabled ? " and unavailable" : ""}.
      </p>
    </div>
  );
}

function AccordionPreview({ state }: { state: PreviewState }) {
  const contentId = useId();
  const triggerId = useId();
  const [isOpen, setIsOpen] = useState(state === "Expanded");

  return (
    <div className="component-showcase-preview component-showcase-preview--accordion">
      <h3>Component guidance</h3>
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="component-showcase-accordion__trigger"
        id={triggerId}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{isOpen ? "Hide implementation detail" : "Show implementation detail"}</span>
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <div
        aria-labelledby={triggerId}
        className="component-showcase-accordion__content"
        hidden={!isOpen}
        id={contentId}
        role="region"
      >
        Keep secondary implementation detail readable and optional. Native button behavior supports Enter and Space without custom keyboard handlers.
      </div>
    </div>
  );
}

function PreviewForSlug({ slug, state }: { slug: InteractiveComponentSlug; state: PreviewState }) {
  switch (slug) {
    case "button":
      return <ButtonPreview key={state} state={state} />;
    case "form-field":
      return <FormFieldPreview key={state} state={state} />;
    case "switch":
      return <SwitchPreview key={state} state={state} />;
    case "accordion":
      return <AccordionPreview key={state} state={state} />;
  }
}

export function InteractiveComponentPreview({ definition }: InteractiveComponentPreviewProps) {
  const [state, setState] = useState<PreviewState>(definition.states[0]);

  return (
    <div className="component-showcase-interaction">
      <PreviewForSlug slug={definition.slug} state={state} />
      <StateSelector
        name={definition.name}
        onChange={setState}
        states={definition.states}
        value={state}
      />
      <CodeDisclosure code={definition.code} name={definition.name} />
    </div>
  );
}
