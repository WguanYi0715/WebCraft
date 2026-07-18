import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PlaygroundWorkspace } from "@/features/playground";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Playground",
  description: "A lightweight browser-only experiment space with an isolated preview.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <section aria-labelledby="playground-title" className="playground-page">
      <Container size="default">
        <header className="playground-page__header">
          <p className="playground-page__eyebrow">Playground</p>
          <h1 id="playground-title">Experiment with a clear boundary</h1>
          <p>
            Edit a small HTML, CSS, and JavaScript example, then run it only when you
            are ready to refresh the preview.
          </p>
        </header>

        <aside aria-labelledby="playground-safety-title" className="playground-safety wc-mist">
          <h2 id="playground-safety-title">Sandbox boundary</h2>
          <p>
            Code runs only inside an isolated iframe. This foundation does not allow
            network requests or external dependencies, supports browser-side HTML, CSS,
            and JavaScript only, and never runs restored drafts or shared code automatically.
          </p>
        </aside>

        <PlaygroundWorkspace />
      </Container>
    </section>
  );
}
