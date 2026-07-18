import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { GuideCard, getPublishedGuides } from "@/features/guides";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Guides",
  description: "Structured development guidance grounded in verified WebCraft practices.",
  path: "/guides",
});

export default function GuidesPage() {
  const publishedGuides = getPublishedGuides();
  const guideCount = publishedGuides.length;

  return (
    <section aria-labelledby="guides-title" className="guides-page">
      <Container size="default">
        <header className="guides-page__header">
          <p className="guides-page__eyebrow">Guides</p>
          <h1 id="guides-title">Guides grounded in real practice</h1>
          <p>
            Read structured notes from WebCraft&apos;s current engineering and component
            foundations, including the boundaries that keep them dependable.
          </p>
          <p className="guides-page__count wc-mist" role="status">
            {guideCount} {guideCount === 1 ? "guide" : "guides"}
          </p>
        </header>

        {guideCount > 0 ? (
          <ul className="guides-grid" role="list">
            {publishedGuides.map((guide) => (
              <li key={guide.slug}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="guides-empty wc-mist" role="status">
            <h2>No guides are published yet</h2>
            <p>Verified local guides will appear here once they are ready to share.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
