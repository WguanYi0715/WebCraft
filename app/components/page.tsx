import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ComponentCard, getAllComponents } from "@/features/component-catalog";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Components",
  description: "Verified UI components with clear contracts, limits, and accessibility context.",
  path: "/components",
});

export default function ComponentsPage() {
  const componentEntries = getAllComponents();
  const componentCount = componentEntries.length;

  return (
    <section aria-labelledby="components-title" className="component-catalog-page">
      <Container size="default">
        <header className="component-catalog-page__header">
          <p className="component-catalog-page__eyebrow">Components</p>
          <h1 id="components-title">Components with clear contracts</h1>
          <p>
            Explore the shared interface primitives currently used by WebCraft, including
            their intended use, limits, and accessibility considerations.
          </p>
          <p className="component-catalog-page__count wc-mist" role="status">
            {componentCount} {componentCount === 1 ? "component" : "components"}
          </p>
        </header>

        {componentCount > 0 ? (
          <ul className="component-catalog-grid" role="list">
            {componentEntries.map((component) => (
              <li key={component.slug}>
                <ComponentCard component={component} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="component-catalog-empty wc-mist" role="status">
            <h2>No components are registered yet</h2>
            <p>Verified shared components will appear here when they are available.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
