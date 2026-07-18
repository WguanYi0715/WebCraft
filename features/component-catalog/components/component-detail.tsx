import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import type { Component } from "../types";
import { ComponentAttributeList } from "./component-attribute-list";
import { ComponentPreview } from "./component-preview";
import { ComponentStatus } from "./component-status";

export interface ComponentDetailProps {
  component: Component;
}

export function ComponentDetail({ component }: ComponentDetailProps) {
  return (
    <article aria-labelledby="component-title" className="component-catalog-detail">
      <Card className="component-catalog-detail__panel" material="surface">
        <header className="component-catalog-detail__header">
          <div className="component-catalog-detail__meta">
            <ComponentStatus status={component.status} />
            <Badge variant="accent">
              <span className="component-catalog-card__label">Category:</span> {component.category}
            </Badge>
          </div>
          <h1 id="component-title">{component.name}</h1>
          <p>{component.description}</p>
        </header>

        <div className="component-catalog-detail__body">
          <section aria-labelledby="component-preview-title">
            <h2 id="component-preview-title">Preview</h2>
            <ComponentPreview component={component} />
          </section>

          <ComponentAttributeList items={component.capabilities} title="Capabilities" />
          <ComponentAttributeList items={component.limitations} title="Limitations" />

          <section aria-labelledby="component-accessibility-title">
            <h2 id="component-accessibility-title">Accessibility</h2>
            <p>{component.accessibility}</p>
          </section>

          <dl className="component-catalog-detail__facts">
            <div>
              <dt>Server compatible</dt>
              <dd>{component.serverCompatible ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Source path</dt>
              <dd>
                <code>{component.sourcePath}</code>
              </dd>
            </div>
          </dl>
        </div>

        <footer className="component-catalog-detail__footer">
          <Link className="component-catalog-link component-catalog-link--secondary" href="/components">
            Back to Components
          </Link>
          <Link className="component-catalog-link" href="/design-system">
            Review Design System
          </Link>
        </footer>
      </Card>
    </article>
  );
}
