import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { adaptLocalComponent } from "../features/component-catalog/adapters";
import { badgeManifest } from "../features/component-catalog/data/manifests/badge";
import { buttonManifest } from "../features/component-catalog/data/manifests/button";
import { cardManifest } from "../features/component-catalog/data/manifests/card";
import { containerManifest } from "../features/component-catalog/data/manifests/container";
import { components } from "../features/component-catalog/data/components";
import {
  getAllComponents,
  getComponentBySlug,
  getComponentsByCategory,
  getFeaturedComponents,
} from "../features/component-catalog/utils";
import { platformPillars } from "../features/home/content";
import { primaryNavigation } from "../lib/navigation";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const componentCatalogFiles = [
  "features/component-catalog/types.ts",
  "features/component-catalog/contracts/component-manifest.ts",
  "features/component-catalog/adapters/local-component-adapter.ts",
  "features/component-catalog/adapters/index.ts",
  "features/component-catalog/data/manifests/button.ts",
  "features/component-catalog/data/manifests/badge.ts",
  "features/component-catalog/data/manifests/card.ts",
  "features/component-catalog/data/manifests/container.ts",
  "features/component-catalog/data/components.ts",
  "features/component-catalog/utils.ts",
  "features/component-catalog/index.ts",
  "features/component-catalog/components/component-card.tsx",
  "features/component-catalog/components/component-detail.tsx",
  "features/component-catalog/components/component-preview.tsx",
  "features/component-catalog/components/component-status.tsx",
  "features/component-catalog/components/component-attribute-list.tsx",
  "features/component-catalog/README.md",
  "app/components/page.tsx",
  "app/components/[slug]/page.tsx",
  "app/components/[slug]/not-found.tsx",
  "styles/component-catalog.css",
];

const manifests = [
  buttonManifest,
  badgeManifest,
  cardManifest,
  containerManifest,
] as const;

describe("component catalog module", () => {
  it("keeps the catalog module, routes, and style entrypoint", () => {
    for (const filePath of componentCatalogFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );

    expect(globalStyles).toContain('@import "../styles/component-catalog.css"');
  });

  it("keeps the normalized Component model and distinct manifest contract", () => {
    const model = readFileSync(
      path.join(projectRoot, "features/component-catalog/types.ts"),
      "utf8",
    );
    const manifestContract = readFileSync(
      path.join(
        projectRoot,
        "features/component-catalog/contracts/component-manifest.ts",
      ),
      "utf8",
    );

    for (const field of [
      "slug",
      "name",
      "summary",
      "description",
      "category",
      "status",
      "technologies",
      "capabilities",
      "limitations",
      "accessibility",
      "serverCompatible",
      "sourcePath",
      "featured",
    ]) {
      expect(model).toContain(`${field}:`);
      expect(manifestContract).toContain(`${field}:`);
    }

    expect(manifestContract).toContain("ComponentManifest");
    expect(manifestContract).toContain('kind: "local"');
  });

  it("keeps each verified component in an independent typed local manifest", () => {
    for (const manifest of manifests) {
      expect(manifest.source).toEqual({ kind: "local" });
      expect(manifest.sourcePath).toMatch(/^components\/ui\/.+\.tsx$/);
      expect(manifest.technologies.length).toBeGreaterThan(0);
      expect(manifest.capabilities.length).toBeGreaterThan(0);
      expect(manifest.limitations.length).toBeGreaterThan(0);
    }

    for (const fileName of ["button", "badge", "card", "container"]) {
      const manifestSource = readFileSync(
        path.join(
          projectRoot,
          `features/component-catalog/data/manifests/${fileName}.ts`,
        ),
        "utf8",
      );
      expect(manifestSource).toContain("satisfies ComponentManifest");
    }
  });

  it("adapts local manifests without mutating or sharing source arrays", () => {
    const sourceTechnologies = [...buttonManifest.technologies];
    const sourceCapabilities = [...buttonManifest.capabilities];
    const adapted = adaptLocalComponent(buttonManifest);
    const mutableAdaptedTechnologies = adapted.technologies as string[];

    mutableAdaptedTechnologies.push("Temporary test value");

    expect(buttonManifest.technologies).toEqual(sourceTechnologies);
    expect(buttonManifest.capabilities).toEqual(sourceCapabilities);
    expect(adapted.capabilities).toEqual(sourceCapabilities);
    expect(adapted.technologies).not.toBe(buttonManifest.technologies);
    expect(adapted.capabilities).not.toBe(buttonManifest.capabilities);
  });

  it("builds a read-only normalized registry through the local adapter", () => {
    const registrySource = readFileSync(
      path.join(projectRoot, "features/component-catalog/data/components.ts"),
      "utf8",
    );

    expect(registrySource).toContain("adaptLocalComponent");
    expect(components).toEqual(manifests.map(adaptLocalComponent));
    expect(components.map((component) => component.slug)).toEqual([
      "button",
      "badge",
      "card",
      "container",
    ]);
    expect(new Set(components.map((component) => component.slug)).size).toBe(
      components.length,
    );
  });

  it("exposes copied query results by slug, category, and featured state", () => {
    const allComponents = getAllComponents();
    const button = getComponentBySlug("button");

    expect(allComponents).toEqual(components);
    expect(allComponents).not.toBe(components);
    expect(allComponents[0]).not.toBe(components[0]);
    expect(allComponents[0]?.technologies).not.toBe(components[0]?.technologies);
    expect(button).toMatchObject({ name: "Button", category: "action" });
    expect(getComponentsByCategory("layout").map((component) => component.slug)).toEqual([
      "container",
    ]);
    expect(getFeaturedComponents().map((component) => component.slug)).toEqual(
      components.map((component) => component.slug),
    );
    expect(getComponentBySlug("unknown-component")).toBeUndefined();
  });

  it("keeps static detail routing, metadata, and recovery paths", () => {
    const detailPage = readFileSync(
      path.join(projectRoot, "app/components/[slug]/page.tsx"),
      "utf8",
    );
    const notFoundPage = readFileSync(
      path.join(projectRoot, "app/components/[slug]/not-found.tsx"),
      "utf8",
    );

    expect(detailPage).toContain("generateStaticParams");
    expect(detailPage).toContain("generateMetadata");
    expect(detailPage).toContain("notFound()");
    expect(notFoundPage).toContain('href="/components"');
    expect(notFoundPage).toContain('href="/design-system"');
  });

  it("uses real shared components for previews without source-format coupling", () => {
    const preview = readFileSync(
      path.join(
        projectRoot,
        "features/component-catalog/components/component-preview.tsx",
      ),
      "utf8",
    );
    const consumerFiles = [
      "app/components/page.tsx",
      "app/components/[slug]/page.tsx",
      "app/components/[slug]/not-found.tsx",
      "features/component-catalog/components/component-card.tsx",
      "features/component-catalog/components/component-detail.tsx",
      "features/component-catalog/components/component-preview.tsx",
      "features/component-catalog/components/component-status.tsx",
      "features/component-catalog/components/component-attribute-list.tsx",
    ];

    expect(preview).toContain('from "@/components/ui"');
    for (const componentName of ["Button", "Badge", "Card", "Container"]) {
      expect(preview).toMatch(new RegExp(`\\b${componentName}\\b`));
    }

    for (const filePath of consumerFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/ComponentManifest|data\/manifests|Manifest/);
      expect(source).not.toContain('"use client"');
    }
  });

  it("keeps catalog runtime local, pure, and free of external access", () => {
    const runtimeFiles = [
      "features/component-catalog/adapters/local-component-adapter.ts",
      "features/component-catalog/data/components.ts",
      "features/component-catalog/utils.ts",
    ];

    for (const filePath of runtimeFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/\bfetch\s*\(|process\.env|GITHUB_TOKEN|axios|graphql/i);
    }
  });

  it("keeps catalog styles token-based and avoids high-emphasis material", () => {
    const styles = readFileSync(
      path.join(projectRoot, "styles/component-catalog.css"),
      "utf8",
    );

    expect(styles).toContain(".component-catalog-");
    expect(styles).toContain("var(--wc-");
    expect(styles).not.toMatch(/crystal/i);
    expect(styles).not.toContain("@keyframes");
  });

  it("keeps the real Components navigation and home-pillar route", () => {
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
    ]);

    expect(platformPillars.find((pillar) => pillar.title === "Projects")).toMatchObject({
      href: "/projects",
      status: "Foundation",
    });
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
