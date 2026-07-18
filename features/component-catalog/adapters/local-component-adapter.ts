import type { ComponentManifest } from "../contracts/component-manifest";
import type { Component } from "../types";

/** Converts a trusted local manifest into an isolated catalog model. */
export function adaptLocalComponent(manifest: ComponentManifest): Component {
  return {
    slug: manifest.slug,
    name: manifest.name,
    summary: manifest.summary,
    description: manifest.description,
    category: manifest.category,
    status: manifest.status,
    technologies: [...manifest.technologies],
    capabilities: [...manifest.capabilities],
    limitations: [...manifest.limitations],
    accessibility: manifest.accessibility,
    serverCompatible: manifest.serverCompatible,
    sourcePath: manifest.sourcePath,
    featured: manifest.featured,
  };
}
