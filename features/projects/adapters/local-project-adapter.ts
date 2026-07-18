import type { ProjectManifest } from "../contracts/project-manifest";
import type { Project } from "../types";

export function adaptLocalProject(manifest: ProjectManifest): Project {
  return {
    slug: manifest.slug,
    name: manifest.name,
    shortDescription: manifest.shortDescription,
    description: manifest.description,
    status: manifest.status,
    technologies: [...manifest.technologies],
    features: [...manifest.features],
    ...(manifest.repositoryUrl === undefined
      ? {}
      : { repositoryUrl: manifest.repositoryUrl }),
    ...(manifest.demoUrl === undefined ? {} : { demoUrl: manifest.demoUrl }),
    ...(manifest.version === undefined ? {} : { version: manifest.version }),
    ...(manifest.lastUpdated === undefined
      ? {}
      : { lastUpdated: manifest.lastUpdated }),
    featured: manifest.featured,
    visibility: manifest.visibility,
  };
}
