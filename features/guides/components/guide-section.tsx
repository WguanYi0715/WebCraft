import type { GuideSection as GuideSectionType } from "../types";
import { CodeExample } from "./code-example";

export interface GuideSectionProps {
  section: GuideSectionType;
}

export function GuideSection({ section }: GuideSectionProps) {
  const titleId = `${section.id}-title`;

  return (
    <section aria-labelledby={titleId} className="guides-section" id={section.id}>
      <h2 id={titleId}>{section.title}</h2>
      <div className="guides-section__copy">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.codeExamples?.map((example) => (
        <CodeExample example={example} key={example.title} />
      ))}
    </section>
  );
}
