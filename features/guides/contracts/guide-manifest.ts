import type {
  GuideCategory,
  GuideDifficulty,
  GuideSection,
  GuideStatus,
} from "../types";

/**
 * Trusted, hand-maintained guide facts and structured content.
 * Pages never consume this source shape directly.
 */
export interface GuideManifest {
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
  readonly source: {
    readonly kind: "local";
  };
}
