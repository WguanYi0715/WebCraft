import Link from "next/link";
import { Card } from "@/components/ui";
import type { Guide } from "../types";
import { GuideMetadata } from "./guide-metadata";
import { GuideSection } from "./guide-section";

export interface GuideDetailProps {
  guide: Guide;
}

export function GuideDetail({ guide }: GuideDetailProps) {
  return (
    <article aria-labelledby="guide-title" className="guides-detail">
      <Card className="guides-detail__panel" material="surface">
        <header className="guides-detail__header">
          <p className="guides-detail__eyebrow">Guides</p>
          <h1 id="guide-title">{guide.title}</h1>
          <p className="guides-detail__summary">{guide.summary}</p>
          <p className="guides-detail__description">{guide.description}</p>
          <GuideMetadata guide={guide} />
        </header>

        <div className="guides-detail__body">
          {guide.sections.map((section) => (
            <GuideSection key={section.id} section={section} />
          ))}
        </div>

        <footer className="guides-detail__footer">
          <Link className="guides-link guides-link--secondary" href="/guides">
            Back to Guides
          </Link>
        </footer>
      </Card>
    </article>
  );
}
