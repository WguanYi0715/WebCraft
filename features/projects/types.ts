export type ProjectStatus =
  | "foundation"
  | "active"
  | "stable"
  | "paused"
  | "archived";

export type ProjectVisibility = "public" | "internal";

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly technologies: readonly string[];
  readonly features: readonly string[];
  readonly repositoryUrl?: string;
  readonly demoUrl?: string;
  readonly version?: string;
  readonly lastUpdated?: string;
  readonly featured: boolean;
  readonly visibility: ProjectVisibility;
}
