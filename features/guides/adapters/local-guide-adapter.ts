import type { GuideManifest } from "../contracts/guide-manifest";
import type { CodeExample, Guide, GuideSection } from "../types";

function copyCodeExample(example: CodeExample): CodeExample {
  return { ...example };
}

function copySection(section: GuideSection): GuideSection {
  const codeExamples = section.codeExamples?.map(copyCodeExample);

  return {
    id: section.id,
    title: section.title,
    paragraphs: [...section.paragraphs],
    ...(codeExamples ? { codeExamples } : {}),
  };
}

/** Converts trusted local guide content into an isolated normalized model. */
export function adaptLocalGuide(manifest: GuideManifest): Guide {
  return {
    slug: manifest.slug,
    title: manifest.title,
    summary: manifest.summary,
    description: manifest.description,
    category: manifest.category,
    difficulty: manifest.difficulty,
    technologies: [...manifest.technologies],
    estimatedMinutes: manifest.estimatedMinutes,
    lastUpdated: manifest.lastUpdated,
    featured: manifest.featured,
    status: manifest.status,
    sections: manifest.sections.map(copySection),
  };
}
