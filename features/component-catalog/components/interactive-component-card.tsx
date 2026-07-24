import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { InteractiveComponentDefinition } from "../data/interactive-components";
import { InteractiveComponentPreview } from "./interactive-component-preview";

export interface InteractiveComponentCardProps {
  definition: InteractiveComponentDefinition;
}

export function InteractiveComponentCard({ definition }: InteractiveComponentCardProps) {
  return (
    <article aria-labelledby={`${definition.slug}-title`} className="component-showcase-card">
      <Card material="surface">
        <CardHeader className="component-showcase-card__header">
          <p className="component-showcase-card__eyebrow">Interactive primitive</p>
          <CardTitle id={`${definition.slug}-title`}>{definition.name}</CardTitle>
          <CardDescription>{definition.summary}</CardDescription>
        </CardHeader>
        <CardContent className="component-showcase-card__content">
          <InteractiveComponentPreview definition={definition} />
          <dl className="component-showcase-card__guidance">
            <div>
              <dt>Use when</dt>
              <dd>{definition.usage}</dd>
            </div>
            <div>
              <dt>Avoid when</dt>
              <dd>{definition.avoid}</dd>
            </div>
            <div>
              <dt>Accessibility</dt>
              <dd>{definition.accessibility}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </article>
  );
}
