import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Guide not found",
  description: "The requested guide is not available.",
};

export default function GuideNotFound() {
  return (
    <section aria-labelledby="guide-not-found-title" className="guides-page">
      <Container size="content">
        <div className="guides-not-found wc-surface">
          <p className="guides-page__eyebrow">Guides</p>
          <h1 id="guide-not-found-title">This guide is not available</h1>
          <p>The guide may not exist or is not part of the current local collection.</p>
          <div className="guides-not-found__actions">
            <Link className="guides-link guides-link--secondary" href="/guides">
              Return to Guides
            </Link>
            <Link className="guides-link" href="/">
              Return home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
