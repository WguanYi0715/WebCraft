import type { GuideSection } from "../types";

export interface GuideTableOfContentsProps {
  readonly sections: readonly Pick<GuideSection, "id" | "title">[];
}

export function GuideTableOfContents({ sections }: GuideTableOfContentsProps) {
  return (
    <nav aria-label="On this page" className="guides-table-of-contents wc-mist">
      <p className="guides-table-of-contents__title">On this page</p>
      <ol className="guides-table-of-contents__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
