import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { adaptLocalGuide } from "../features/guides/adapters";
import { expandableComponentCatalogManifest } from "../features/guides/data/manifests/expandable-component-catalog";
import { reliableNextjsFoundationManifest } from "../features/guides/data/manifests/reliable-nextjs-foundation";
import { guides } from "../features/guides/data/guides";
import {
  getFeaturedGuides,
  getGuideBySlug,
  getGuidesByCategory,
  getGuidesByDifficulty,
  getPublishedGuides,
} from "../features/guides/utils";
import type { GuideSection } from "../features/guides/types";
import { platformPillars } from "../features/home/content";
import { primaryNavigation } from "../lib/navigation";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const guideModuleFiles = [
  "features/guides/types.ts",
  "features/guides/contracts/guide-manifest.ts",
  "features/guides/adapters/local-guide-adapter.ts",
  "features/guides/adapters/index.ts",
  "features/guides/data/manifests/reliable-nextjs-foundation.ts",
  "features/guides/data/manifests/expandable-component-catalog.ts",
  "features/guides/data/guides.ts",
  "features/guides/utils.ts",
  "features/guides/index.ts",
  "features/guides/components/guide-card.tsx",
  "features/guides/components/guide-detail.tsx",
  "features/guides/components/guide-metadata.tsx",
  "features/guides/components/guide-section.tsx",
  "features/guides/components/code-example.tsx",
  "features/guides/README.md",
  "app/guides/page.tsx",
  "app/guides/[slug]/page.tsx",
  "app/guides/[slug]/not-found.tsx",
  "styles/guides.css",
];

const manifests = [
  reliableNextjsFoundationManifest,
  expandableComponentCatalogManifest,
] as const;

describe("guides module", () => {
  it("keeps the Guides module, routes, and style entrypoint", () => {
    for (const filePath of guideModuleFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );
    expect(globalStyles).toContain('@import "../styles/guides.css"');
  });

  it("keeps the normalized Guide model and its distinct manifest contract", () => {
    const model = readFileSync(
      path.join(projectRoot, "features/guides/types.ts"),
      "utf8",
    );
    const manifestContract = readFileSync(
      path.join(projectRoot, "features/guides/contracts/guide-manifest.ts"),
      "utf8",
    );

    for (const field of [
      "slug",
      "title",
      "summary",
      "description",
      "category",
      "difficulty",
      "technologies",
      "estimatedMinutes",
      "lastUpdated",
      "featured",
      "status",
      "sections",
    ]) {
      expect(model).toContain(`${field}:`);
      expect(manifestContract).toContain(`${field}:`);
    }

    for (const sectionField of ["id", "title", "paragraphs"]) {
      expect(model).toContain(`${sectionField}:`);
    }
    expect(model).toContain("codeExamples?:");
    for (const exampleField of ["title", "language", "code", "description"]) {
      expect(model).toContain(`${exampleField}`);
    }
    expect(manifestContract).toContain("GuideManifest");
    expect(manifestContract).toContain('kind: "local"');
  });

  it("keeps two independent typed local manifests with structured content", () => {
    for (const manifest of manifests) {
      expect(manifest.source).toEqual({ kind: "local" });
      expect(manifest.sections.length).toBeGreaterThan(0);
      expect(
        (manifest.sections as readonly GuideSection[]).some(
          (section) => section.codeExamples?.length,
        ),
      ).toBe(true);
    }

    for (const fileName of [
      "reliable-nextjs-foundation",
      "expandable-component-catalog",
    ]) {
      const manifestSource = readFileSync(
        path.join(projectRoot, `features/guides/data/manifests/${fileName}.ts`),
        "utf8",
      );
      expect(manifestSource).toContain("satisfies GuideManifest");
    }
  });

  it("adapts local guides without mutating or sharing source content", () => {
    const sourceSections: readonly GuideSection[] =
      reliableNextjsFoundationManifest.sections;
    const sourceTechnologies = [...reliableNextjsFoundationManifest.technologies];
    const sourceParagraphs = [...sourceSections[0]!.paragraphs];
    const sourceExample = sourceSections.find(
      (section) => section.codeExamples?.length,
    )?.codeExamples?.[0];
    const adapted = adaptLocalGuide(reliableNextjsFoundationManifest);
    const adaptedSection = adapted.sections[0]!;

    expect(reliableNextjsFoundationManifest.technologies).toEqual(sourceTechnologies);
    expect(sourceSections[0]!.paragraphs).toEqual(sourceParagraphs);
    expect(adapted.technologies).not.toBe(
      reliableNextjsFoundationManifest.technologies,
    );
    expect(adapted.sections).not.toBe(reliableNextjsFoundationManifest.sections);
    expect(adaptedSection).not.toBe(sourceSections[0]);
    expect(adaptedSection.paragraphs).not.toBe(sourceSections[0]!.paragraphs);
    expect(adapted.sections.find((section) => section.codeExamples?.length)?.codeExamples?.[0]).not.toBe(
      sourceExample,
    );
  });

  it("builds only the verified guide registry through the local adapter", () => {
    const registrySource = readFileSync(
      path.join(projectRoot, "features/guides/data/guides.ts"),
      "utf8",
    );

    expect(registrySource).toContain("adaptLocalGuide");
    expect(guides).toEqual(manifests.map(adaptLocalGuide));
    expect(guides.map((guide) => guide.slug)).toEqual([
      "reliable-nextjs-foundation",
      "expandable-component-catalog",
    ]);
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(guides.length);
  });

  it("exposes copied published, slug, category, difficulty, and featured queries", () => {
    const publishedGuides = getPublishedGuides();
    const foundationGuide = getGuideBySlug("reliable-nextjs-foundation");

    expect(publishedGuides).toEqual(guides);
    expect(publishedGuides).not.toBe(guides);
    expect(publishedGuides[0]).not.toBe(guides[0]);
    expect(publishedGuides[0]?.sections).not.toBe(guides[0]?.sections);
    expect(foundationGuide).toMatchObject({
      title: "Building a Reliable Next.js Foundation",
      category: "foundation",
      difficulty: "beginner",
      status: "foundation",
    });
    expect(getGuidesByCategory("components").map((guide) => guide.slug)).toEqual([
      "expandable-component-catalog",
    ]);
    expect(getGuidesByDifficulty("intermediate").map((guide) => guide.slug)).toEqual([
      "expandable-component-catalog",
    ]);
    expect(getFeaturedGuides().map((guide) => guide.slug)).toEqual(
      guides.map((guide) => guide.slug),
    );
    expect(getGuideBySlug("unknown-guide")).toBeUndefined();
  });

  it("keeps static detail routing, metadata, anchors, and recovery paths", () => {
    const detailPage = readFileSync(
      path.join(projectRoot, "app/guides/[slug]/page.tsx"),
      "utf8",
    );
    const notFoundPage = readFileSync(
      path.join(projectRoot, "app/guides/[slug]/not-found.tsx"),
      "utf8",
    );
    const section = readFileSync(
      path.join(projectRoot, "features/guides/components/guide-section.tsx"),
      "utf8",
    );

    expect(detailPage).toContain("generateStaticParams");
    expect(detailPage).toContain("generateMetadata");
    expect(detailPage).toContain("notFound()");
    expect(section).toContain("id={section.id}");
    expect(notFoundPage).toContain('href="/guides"');
    expect(notFoundPage).toContain('href="/"');
  });

  it("keeps pages and business components independent from manifests and client code", () => {
    const consumerFiles = [
      "app/guides/page.tsx",
      "app/guides/[slug]/page.tsx",
      "app/guides/[slug]/not-found.tsx",
      "features/guides/components/guide-card.tsx",
      "features/guides/components/guide-detail.tsx",
      "features/guides/components/guide-metadata.tsx",
      "features/guides/components/guide-section.tsx",
      "features/guides/components/code-example.tsx",
    ];

    for (const filePath of consumerFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/GuideManifest|data\/manifests|Manifest/);
      expect(source).not.toContain('"use client"');
    }
  });

  it("renders trusted code examples semantically without execution helpers", () => {
    const codeExample = readFileSync(
      path.join(projectRoot, "features/guides/components/code-example.tsx"),
      "utf8",
    );

    expect(codeExample).toContain("<pre>");
    expect(codeExample).toContain("<code");
    expect(codeExample).not.toContain("dangerouslySetInnerHTML");
    expect(codeExample).not.toMatch(/clipboard|navigator\.|eval\s*\(/i);
  });

  it("keeps the Guides runtime local and free of external access", () => {
    const runtimeFiles = [
      "features/guides/adapters/local-guide-adapter.ts",
      "features/guides/data/guides.ts",
      "features/guides/utils.ts",
    ];

    for (const filePath of runtimeFiles) {
      const source = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(source).not.toMatch(/\bfetch\s*\(|process\.env|axios|graphql|CMS|MDX/i);
    }
  });

  it("keeps Guides styles token-based and avoids high-emphasis material", () => {
    const styles = readFileSync(path.join(projectRoot, "styles/guides.css"), "utf8");

    expect(styles).toContain(".guides-");
    expect(styles).toContain("var(--wc-");
    expect(styles).not.toMatch(/crystal/i);
    expect(styles).not.toContain("@keyframes");
    expect(styles).toContain("overflow-x: auto");
  });

  it("keeps Guides alongside the real Playground route", () => {
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
    ]);

    for (const title of ["Projects", "Components", "Guides"]) {
      expect(platformPillars.find((pillar) => pillar.title === title)).toMatchObject({
        href: `/${title.toLowerCase()}`,
        status: "Foundation",
      });
    }
    expect(platformPillars.find((pillar) => pillar.title === "Playground")).toMatchObject({
      href: "/playground",
      status: "Foundation",
    });
  });
});
