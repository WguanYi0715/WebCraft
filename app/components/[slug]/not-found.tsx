import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Component not found",
  description: "The requested component is not available.",
};

export default function ComponentNotFound() {
  return (
    <section aria-labelledby="component-not-found-title" className="component-catalog-page">
      <Container size="content">
        <div className="component-catalog-not-found wc-surface">
          <p className="component-catalog-page__eyebrow">Components</p>
          <h1 id="component-not-found-title">This component is not available</h1>
          <p>The component may not exist or is not part of the current catalog.</p>
          <div className="component-catalog-not-found__actions">
            <Link className="component-catalog-link component-catalog-link--secondary" href="/components">
              Return to Components
            </Link>
            <Link className="component-catalog-link" href="/design-system">
              Review Design System
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
