import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { platformPillars } from "../features/home/content";
import { adaptLocalProject } from "../features/projects/adapters";
import { webcraftManifest } from "../features/projects/data/manifests/webcraft";
import { projects } from "../features/projects/data/projects";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getPublicProjects,
} from "../features/projects/utils";
import { primaryNavigation } from "../lib/navigation";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const projectModuleFiles = [
  "features/projects/types.ts",
  "features/projects/contracts/project-source.ts",
  "features/projects/contracts/project-manifest.ts",
  "features/projects/adapters/local-project-adapter.ts",
  "features/projects/adapters/index.ts",
  "features/projects/data/manifests/webcraft.ts",
  "features/projects/data/projects.ts",
  "features/projects/utils.ts",
  "features/projects/index.ts",
  "features/projects/components/project-card.tsx",
  "features/projects/components/project-status.tsx",
  "features/projects/components/project-technology-list.tsx",
  "features/projects/components/project-detail.tsx",
  "features/projects/README.md",
  "app/projects/page.tsx",
  "app/projects/[slug]/page.tsx",
  "app/projects/[slug]/not-found.tsx",
  "styles/projects.css",
];

describe("projects module", () => {
  it("keeps the Projects module, routes, and style entrypoints", () => {
    for (const filePath of projectModuleFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );

    expect(globalStyles).toContain('@import "../styles/projects.css"');
  });

  it("keeps a normalized Project model with optional external fields", () => {
    const model = readFileSync(
      path.join(projectRoot, "features/projects/types.ts"),
      "utf8",
    );

    for (const field of [
      "slug",
      "name",
      "shortDescription",
      "description",
      "status",
      "technologies",
      "features",
      "featured",
      "visibility",
    ]) {
      expect(model).toContain(`${field}:`);
    }

    for (const optionalField of [
      "repositoryUrl",
      "demoUrl",
      "version",
      "lastUpdated",
    ]) {
      expect(model).toContain(`${optionalField}?:`);
    }
  });

  it("keeps an independent local manifest and source contract", () => {
    const manifestContract = readFileSync(
      path.join(projectRoot, "features/projects/contracts/project-manifest.ts"),
      "utf8",
    );
    const manifestSource = readFileSync(
      path.join(projectRoot, "features/projects/data/manifests/webcraft.ts"),
      "utf8",
    );
    const sourceContract = readFileSync(
      path.join(projectRoot, "features/projects/contracts/project-source.ts"),
      "utf8",
    );

    expect(manifestContract).toContain("ProjectManifest");
    expect(manifestSource).toContain("satisfies ProjectManifest");
    expect(webcraftManifest.source).toEqual({ kind: "local" });
    expect(sourceContract).toContain('"local"');
    expect(sourceContract).toContain('"github"');

    for (const field of [
      "slug",
      "name",
      "shortDescription",
      "description",
      "status",
      "technologies",
      "features",
      "featured",
      "visibility",
    ]) {
      expect(manifestContract).toContain(`${field}:`);
    }
  });

  it("adapts local manifests without modifying their source data", () => {
    const technologiesBefore = [...webcraftManifest.technologies];
    const featuresBefore = [...webcraftManifest.features];
    const adaptedProject = adaptLocalProject(webcraftManifest);

    expect(webcraftManifest.technologies).toEqual(technologiesBefore);
    expect(webcraftManifest.features).toEqual(featuresBefore);
    expect(adaptedProject.technologies).toEqual(technologiesBefore);
    expect(adaptedProject.features).toEqual(featuresBefore);
    expect(adaptedProject.technologies).not.toBe(webcraftManifest.technologies);
    expect(adaptedProject.features).not.toBe(webcraftManifest.features);
    expect(adaptedProject.repositoryUrl).toBeUndefined();
    expect(adaptedProject.demoUrl).toBeUndefined();
    expect(Object.hasOwn(adaptedProject, "repositoryUrl")).toBe(false);
    expect(Object.hasOwn(adaptedProject, "demoUrl")).toBe(false);
  });

  it("builds the normalized registry through the local adapter", () => {
    const registrySource = readFileSync(
      path.join(projectRoot, "features/projects/data/projects.ts"),
      "utf8",
    );

    expect(registrySource).toContain("adaptLocalProject");
    expect(projects).toEqual([adaptLocalProject(webcraftManifest)]);
  });

  it("registers only the verified WebCraft project with unique slugs", () => {
    expect(projects.map((project) => project.slug)).toEqual(["webcraft"]);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);

    const webcraft = getProjectBySlug("webcraft");
    expect(webcraft).toMatchObject({
      name: "WebCraft",
      status: "foundation",
      featured: true,
      visibility: "public",
    });
    expect(webcraft?.technologies).toEqual(
      expect.arrayContaining(["Next.js", "React", "TypeScript", "Tailwind CSS", "Vitest"]),
    );
    expect(webcraft?.repositoryUrl).toBeUndefined();
    expect(webcraft?.demoUrl).toBeUndefined();
  });

  it("exposes pure public, slug, and featured queries", () => {
    expect(getPublicProjects()).toEqual(projects);
    expect(getFeaturedProjects()).toEqual(projects);
    expect(getPublicProjects()).not.toBe(projects);
    expect(getFeaturedProjects()).not.toBe(projects);
    expect(getProjectBySlug("missing-project")).toBeUndefined();
  });

  it("keeps the detail route static, metadata-aware, and recoverable", () => {
    const detailPage = readFileSync(
      path.join(projectRoot, "app/projects/[slug]/page.tsx"),
      "utf8",
    );
    const notFoundPage = readFileSync(
      path.join(projectRoot, "app/projects/[slug]/not-found.tsx"),
      "utf8",
    );

    expect(detailPage).toContain("generateStaticParams");
    expect(detailPage).toContain("generateMetadata");
    expect(detailPage).toContain("notFound()");
    expect(notFoundPage).toContain('href="/projects"');
  });

  it("keeps pages and components independent from source formats and external access", () => {
    const consumerFiles = [
      "app/projects/page.tsx",
      "app/projects/[slug]/page.tsx",
      "app/projects/[slug]/not-found.tsx",
      "features/projects/components/project-card.tsx",
      "features/projects/components/project-detail.tsx",
      "features/projects/components/project-status.tsx",
      "features/projects/components/project-technology-list.tsx",
    ];
    const runtimeFiles = [
      "features/projects/adapters/local-project-adapter.ts",
      "features/projects/data/projects.ts",
      "features/projects/utils.ts",
    ];

    for (const filePath of consumerFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/ProjectManifest|data\/manifests|webcraftManifest/);
    }

    for (const filePath of runtimeFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/\bfetch\s*\(|process\.env|GITHUB_TOKEN/);
    }
  });

  it("keeps Projects as server components and reuses the design system without Crystal", () => {
    for (const filePath of projectModuleFiles.filter((filePath) => filePath.endsWith(".tsx"))) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toContain('"use client"');
    }

    const projectStyles = readFileSync(
      path.join(projectRoot, "styles/projects.css"),
      "utf8",
    );
    expect(projectStyles).toContain(".projects-");
    expect(projectStyles).toContain("var(--wc-");
    expect(projectStyles).not.toMatch(/crystal/i);
  });

  it("keeps the real Projects navigation and home-pillar route", () => {
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
    ]);

    const projectsPillar = platformPillars.find((pillar) => pillar.title === "Projects");
    expect(projectsPillar).toMatchObject({ href: "/projects", status: "Foundation" });

    expect(platformPillars.find((pillar) => pillar.title === "Components")).toMatchObject({
      href: "/components",
      status: "Foundation",
    });

    expect(platformPillars.find((pillar) => pillar.title === "Guides")).toMatchObject({
      href: "/guides",
      status: "Foundation",
    });

    expect(platformPillars.find((pillar) => pillar.title === "Playground")).toMatchObject({
      href: "/playground",
      status: "Foundation",
    });
  });
});
