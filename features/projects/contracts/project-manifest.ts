import type { ProjectStatus, ProjectVisibility } from "../types";
import type { LocalProjectSource } from "./project-source";

export interface ProjectManifest {
  readonly source: LocalProjectSource;
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
