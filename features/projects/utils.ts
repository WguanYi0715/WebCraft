import { projects } from "./data/projects";
import type { Project } from "./types";

export function getPublicProjects(): readonly Project[] {
  return projects.filter((project) => project.visibility === "public");
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): readonly Project[] {
  return getPublicProjects().filter((project) => project.featured);
}
