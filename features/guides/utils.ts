import { guides } from "./data/guides";
import type { CodeExample, Guide, GuideCategory, GuideDifficulty, GuideSection } from "./types";

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

function copyGuide(guide: Guide): Guide {
  return {
    ...guide,
    technologies: [...guide.technologies],
    sections: guide.sections.map(copySection),
  };
}

/** Foundation, published, and reviewing guides remain visible while they are useful. */
export function getPublishedGuides(): readonly Guide[] {
  return guides
    .filter((guide) => guide.status !== "archived")
    .map(copyGuide);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const guide = guides.find((entry) => entry.slug === slug);

  return guide && guide.status !== "archived" ? copyGuide(guide) : undefined;
}

export function getGuidesByCategory(category: GuideCategory): readonly Guide[] {
  return getPublishedGuides().filter((guide) => guide.category === category);
}

export function getGuidesByDifficulty(
  difficulty: GuideDifficulty,
): readonly Guide[] {
  return getPublishedGuides().filter((guide) => guide.difficulty === difficulty);
}

export function getFeaturedGuides(): readonly Guide[] {
  return getPublishedGuides().filter((guide) => guide.featured);
}
