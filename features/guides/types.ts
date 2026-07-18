export type GuideStatus = "foundation" | "published" | "reviewing" | "archived";

export type GuideDifficulty = "beginner" | "intermediate" | "advanced";

export type GuideCategory = "foundation" | "architecture" | "components";

export interface CodeExample {
  readonly title: string;
  readonly language: string;
  readonly code: string;
  readonly description?: string;
}

export interface GuideSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly codeExamples?: readonly CodeExample[];
}

/** The normalized model consumed by all Guides pages and business components. */
export interface Guide {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  readonly category: GuideCategory;
  readonly difficulty: GuideDifficulty;
  readonly technologies: readonly string[];
  readonly estimatedMinutes: number;
  readonly lastUpdated: string;
  readonly featured: boolean;
  readonly status: GuideStatus;
  readonly sections: readonly GuideSection[];
}
