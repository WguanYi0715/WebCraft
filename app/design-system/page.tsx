import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site-config";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";

export const metadata: Metadata = createPageMetadata({
  title: "Design System",
  description: "Internal preview for WebCraft foundation components.",
  path: "/design-system",
});

const badgeExamples = [
  ["neutral", "Neutral"],
  ["accent", "Accent"],
  ["success", "Stable"],
  ["warning", "Review"],
  ["danger", "Blocked"],
  ["info", "Info"],
] as const;

export default function DesignSystemPage() {
  return (
    <div className="wc-design-system">
      <Container size="default">
        <div className="wc-design-system__stack">
          <header className="wc-design-system__hero">
            <p className="wc-design-system__eyebrow">WebCraft Foundation</p>
            <h1 className="wc-design-system__title">Design system preview</h1>
            <p className="wc-design-system__lead">
              Internal reference for shared primitives, material choices, and
              accessible interaction states.
            </p>
            <p className="wc-design-system__note wc-mist">
              Crystal is reserved for brand-level visual moments and is not a
              material for ordinary components.
            </p>
          </header>

          <section aria-labelledby="button-heading" className="wc-showcase-section">
            <div className="wc-showcase-section__header">
              <h2 className="wc-showcase-section__title" id="button-heading">
                Button
              </h2>
              <p className="wc-showcase-section__description">
                Primary actions, secondary choices, quiet actions, and
                destructive actions share one native button contract.
              </p>
            </div>
            <div className="wc-showcase-button-row">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="wc-showcase-button-row">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
            <div className="wc-showcase-button-row">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <p className="wc-showcase-section__description">
                Use Tab to inspect focus; hover and active feedback are
                intentionally subtle.
              </p>
            </div>
          </section>

          <section aria-labelledby="badge-heading" className="wc-showcase-section">
            <div className="wc-showcase-section__header">
              <h2 className="wc-showcase-section__title" id="badge-heading">
                Badge
              </h2>
              <p className="wc-showcase-section__description">
                Labels combine concise text with restrained status color.
              </p>
            </div>
            <div className="wc-showcase-badge-row">
              {badgeExamples.map(([variant, label]) => (
                <Badge key={variant} variant={variant}>
                  {label}
                </Badge>
              ))}
            </div>
          </section>

          <section aria-labelledby="card-heading" className="wc-showcase-section">
            <div className="wc-showcase-section__header">
              <h2 className="wc-showcase-section__title" id="card-heading">
                Card materials
              </h2>
              <p className="wc-showcase-section__description">
                Surface is the default reading layer. Mist and Glass add
                hierarchy only when their context calls for it.
              </p>
            </div>
            <div className="wc-showcase-card-grid">
              <Card material="surface">
                <CardHeader>
                  <CardTitle>Surface</CardTitle>
                  <CardDescription>Stable, readable, and low distraction.</CardDescription>
                </CardHeader>
                <CardContent>Default material for ordinary content panels.</CardContent>
                <CardFooter>
                  <Badge>Default</Badge>
                </CardFooter>
              </Card>
              <Card material="mist">
                <CardHeader>
                  <CardTitle>Mist</CardTitle>
                  <CardDescription>Light separation for supporting detail.</CardDescription>
                </CardHeader>
                <CardContent>Useful for secondary information and filters.</CardContent>
                <CardFooter>
                  <Badge variant="info">Supporting</Badge>
                </CardFooter>
              </Card>
              <Card material="glass">
                <CardHeader>
                  <CardTitle>Glass</CardTitle>
                  <CardDescription>Explicitly selected for functional layers.</CardDescription>
                </CardHeader>
                <CardContent>Use sparingly, with readable content and clear bounds.</CardContent>
                <CardFooter>
                  <Badge variant="accent">Explicit</Badge>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </Container>

      <section aria-labelledby="container-heading" className="wc-showcase-section">
        <Container size="default">
          <div className="wc-showcase-section__header">
            <h2 className="wc-showcase-section__title" id="container-heading">
              Container widths
            </h2>
            <p className="wc-showcase-section__description">
              Every size preserves the shared horizontal safety gutter instead
              of stretching content indefinitely.
            </p>
          </div>
        </Container>
        <div className="wc-showcase-container-stack">
          <Container size="content">
            <div className="wc-container-demo">
              <span className="wc-container-demo__label">content</span> —
              optimized for concentrated reading.
            </div>
          </Container>
          <Container size="default">
            <div className="wc-container-demo">
              <span className="wc-container-demo__label">default</span> —
              balanced page composition.
            </div>
          </Container>
          <Container size="wide">
            <div className="wc-container-demo">
              <span className="wc-container-demo__label">wide</span> — for
              broader layouts with a controlled maximum.
            </div>
          </Container>
          <Container size="full">
            <div className="wc-container-demo">
              <span className="wc-container-demo__label">full</span> — full
              width while retaining safe edges.
            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}
