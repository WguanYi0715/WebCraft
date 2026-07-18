import type { PlaygroundTemplate } from "../templates";

export interface TemplateSelectorProps {
  readonly selectedTemplateId: string;
  readonly templates: readonly PlaygroundTemplate[];
  readonly onSelectedTemplateChange: (templateId: string) => void;
  readonly onLoadTemplate: () => void;
}

export function TemplateSelector({
  selectedTemplateId,
  templates,
  onSelectedTemplateChange,
  onLoadTemplate,
}: TemplateSelectorProps) {
  return (
    <div className="playground-template-selector">
      <label htmlFor="playground-template">Template</label>
      <div className="playground-template-selector__controls">
        <select
          id="playground-template"
          onChange={(event) => onSelectedTemplateChange(event.target.value)}
          value={selectedTemplateId}
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <button className="playground-toolbar__button" onClick={onLoadTemplate} type="button">
          Load template
        </button>
      </div>
      <p>
        {templates.find((template) => template.id === selectedTemplateId)?.description}
      </p>
    </div>
  );
}
