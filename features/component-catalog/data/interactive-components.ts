export type InteractiveComponentSlug = "button" | "form-field" | "switch" | "accordion";

export interface InteractiveComponentDefinition {
  readonly slug: InteractiveComponentSlug;
  readonly name: string;
  readonly summary: string;
  readonly states: readonly string[];
  readonly usage: string;
  readonly avoid: string;
  readonly accessibility: string;
  readonly code: string;
}

export const interactiveComponents = [
  {
    slug: "button",
    name: "Button",
    summary: "A native action control with complete busy, disabled, focus, and hover states.",
    states: ["Default", "Hover", "Focus", "Loading", "Disabled"],
    usage: "Use for a clear, immediate action such as saving a form or confirming a choice.",
    avoid: "Do not use it for navigation; use a link when the destination is the primary outcome.",
    accessibility: "Loading exposes aria-busy and disables repeat activation; disabled uses the native attribute.",
    code: `<Button loading={isSaving} onClick={handleSave}>
  Save changes
</Button>`,
  },
  {
    slug: "form-field",
    name: "Form Field",
    summary: "A labelled input that makes entered, error, disabled, and focus states explicit.",
    states: ["Default", "Focus", "Filled", "Error", "Disabled"],
    usage: "Use for one clear piece of information with a visible label and nearby validation feedback.",
    avoid: "Do not replace the label with a placeholder or put an error message far from its field.",
    accessibility: "The label is associated with the input; errors use aria-invalid and aria-describedby.",
    code: `<label htmlFor="project-name">Project name</label>
<input
  aria-describedby={error ? "project-name-error" : undefined}
  aria-invalid={Boolean(error)}
  id="project-name"
  name="project-name"
/>
{error ? <p id="project-name-error">Choose a name with at least 3 characters.</p> : null}`,
  },
  {
    slug: "switch",
    name: "Switch",
    summary: "A labelled binary control with an explicit state, native keyboard operation, and a visible focus ring.",
    states: ["Off", "On", "Focus", "Disabled"],
    usage: "Use for an immediate on/off preference whose current state can be understood at a glance.",
    avoid: "Do not use it for actions that need a separate confirmation or a multi-step choice.",
    accessibility: "A native checkbox with switch semantics supports Space and exposes an accessible name and state.",
    code: `<label htmlFor="compact-layout">Compact layout</label>
<input
  checked={compactLayout}
  id="compact-layout"
  onChange={(event) => setCompactLayout(event.target.checked)}
  role="switch"
  type="checkbox"
/>`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    summary: "A progressive-disclosure pattern with native keyboard operation and an explicit expanded relationship.",
    states: ["Collapsed", "Expanded"],
    usage: "Use to reveal supporting detail without interrupting the primary scan path.",
    avoid: "Do not hide essential instructions or the only way to complete a task inside the panel.",
    accessibility: "The trigger is a button whose aria-expanded state controls a labelled content region.",
    code: `<button
  aria-controls="component-details"
  aria-expanded={isOpen}
  onClick={() => setIsOpen((open) => !open)}
  type="button"
>
  Component guidance
</button>
<div hidden={!isOpen} id="component-details">
  Keep secondary implementation detail readable and optional.
</div>`,
  },
] as const satisfies readonly InteractiveComponentDefinition[];
