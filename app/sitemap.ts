import type { MetadataRoute } from "next";
import { getAllComponents } from "../features/component-catalog/utils";
import { getPublishedGuides } from "../features/guides/utils";
import { getPublicProjects } from "../features/projects/utils";
import { createAbsoluteUrl } from "../lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/projects",
    "/components",
    "/guides",
    "/playground",
    "/design-system",
  ];

  return [
    ...staticPaths.map((path) => ({ url: createAbsoluteUrl(path) })),
    ...getPublicProjects().map((project) => ({
      url: createAbsoluteUrl(`/projects/${project.slug}`),
      ...(project.lastUpdated ? { lastModified: project.lastUpdated } : {}),
    })),
    ...getAllComponents().map((component) => ({
      url: createAbsoluteUrl(`/components/${component.slug}`),
    })),
    ...getPublishedGuides().map((guide) => ({
      url: createAbsoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.lastUpdated,
    })),
  ];
}
