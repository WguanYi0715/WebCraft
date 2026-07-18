import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { getAllComponents } from "../features/component-catalog/utils";
import { getPublishedGuides } from "../features/guides/utils";
import { getPublicProjects } from "../features/projects/utils";
import {
  createAbsoluteUrl,
  createPageMetadata,
  getSiteUrl,
  siteConfig,
} from "../lib/site-config";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(filePath: string) {
  return readFileSync(path.join(projectRoot, filePath), "utf8");
}

describe("production readiness foundation", () => {
  it("keeps a complete site configuration and safely validates SITE_URL", () => {
    expect(siteConfig.name).toBe("WebCraft");
    expect(siteConfig.description).not.toHaveLength(0);
    expect(getSiteUrl()).toBe("http://localhost:3000");
    expect(getSiteUrl("not a URL")).toBe("http://localhost:3000");
    expect(getSiteUrl("ftp://example.com")).toBe("http://localhost:3000");
    expect(getSiteUrl("https://user:pass@example.com")).toBe("http://localhost:3000");
    expect(createAbsoluteUrl("/guides")).toBe("http://localhost:3000/guides");
  });

  it("uses one metadata helper for the layout and every real page route", () => {
    const files = [
      "app/page.tsx",
      "app/projects/page.tsx",
      "app/projects/[slug]/page.tsx",
      "app/components/page.tsx",
      "app/components/[slug]/page.tsx",
      "app/guides/page.tsx",
      "app/guides/[slug]/page.tsx",
      "app/playground/page.tsx",
      "app/design-system/page.tsx",
    ];

    for (const filePath of files) {
      expect(readProjectFile(filePath)).toContain("createPageMetadata");
    }

    const metadata = createPageMetadata({
      title: "Projects",
      description: "Verified project foundations.",
      path: "/projects",
    });
    const layout = readProjectFile("app/layout.tsx");

    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/projects");
    expect(metadata.openGraph).toMatchObject({
      title: "Projects | WebCraft",
      url: "http://localhost:3000/projects",
      images: ["http://localhost:3000/opengraph-image"],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Projects | WebCraft",
      description: "Verified project foundations.",
      images: ["http://localhost:3000/opengraph-image"],
    });
    expect(layout).toContain("metadataBase");
    expect(layout).toContain("siteConfig");
    expect(layout).toContain("titleTemplate");
    expect(layout).toContain("twitter");
  });

  it("creates complete page-level social metadata for every dynamic detail type", () => {
    const previousSiteUrl = process.env.SITE_URL;
    process.env.SITE_URL = "https://example.com";

    try {
      const pages = [
        {
          kind: "Project",
          title: "WebCraft | Projects",
          description: "An expandable frontend and backend web development platform.",
          path: "/projects/webcraft",
        },
        {
          kind: "Component",
          title: "Button | Components",
          description: "A native button with clear visual variants and controlled busy states.",
          path: "/components/button",
        },
        {
          kind: "Guide",
          title: "Building a Reliable Next.js Foundation | Guides",
          description:
            "Use clear rules, stable directories, and one repeatable quality chain before expanding a Next.js application.",
          path: "/guides/reliable-nextjs-foundation",
        },
      ];

      for (const page of pages) {
        const metadata = createPageMetadata(page);
        expect(metadata.openGraph).toMatchObject({
          title: `${page.title} | WebCraft`,
          description: page.description,
          url: `https://example.com${page.path}`,
          images: ["https://example.com/opengraph-image"],
        });
        expect(metadata.twitter).toMatchObject({
          card: "summary_large_image",
          title: `${page.title} | WebCraft`,
          description: page.description,
          images: ["https://example.com/opengraph-image"],
        });
        expect(JSON.stringify(metadata)).not.toMatch(/localhost|web-craft-tweld|github\.com/i);
      }
    } finally {
      if (previousSiteUrl === undefined) {
        delete process.env.SITE_URL;
      } else {
        process.env.SITE_URL = previousSiteUrl;
      }
    }
  });

  it("generates sitemap and robots entries from real routes and normalized local data", () => {
    const entries = sitemap();
    const paths = entries.map((entry) => new URL(entry.url).pathname);
    const expectedPaths = [
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
      ...getPublicProjects().map((project) => `/projects/${project.slug}`),
      ...getAllComponents().map((component) => `/components/${component.slug}`),
      ...getPublishedGuides().map((guide) => `/guides/${guide.slug}`),
    ];

    expect(paths).toEqual(expectedPaths);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).not.toContain("/404");
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });

  it("keeps system recovery, OG, and security boundaries in place", () => {
    for (const filePath of [
      "app/not-found.tsx",
      "app/error.tsx",
      "app/opengraph-image.tsx",
      "app/sitemap.ts",
      "app/robots.ts",
      "styles/system-pages.css",
    ]) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const errorPage = readProjectFile("app/error.tsx");
    const nextConfig = readProjectFile("next.config.ts");
    const previewFrame = readProjectFile("features/playground/components/preview-frame.tsx");
    const previewDocument = readProjectFile("features/playground/build-preview-document.ts");

    expect(errorPage).toContain('"use client"');
    expect(errorPage).toContain("<button");
    expect(errorPage).toContain("Try again");
    expect(errorPage).not.toContain("dangerouslySetInnerHTML");
    expect(nextConfig).toContain("X-Content-Type-Options");
    expect(nextConfig).toContain("Referrer-Policy");
    expect(nextConfig).toContain("Permissions-Policy");
    expect(previewFrame).toContain('sandbox="allow-scripts"');
    expect(previewDocument).toContain("Content-Security-Policy");
  });

  it("adds no external runtime access, dependencies, or placeholder links", () => {
    const packageJson = readProjectFile("package.json");
    const runtimeFiles = [
      "lib/site-config.ts",
      "app/sitemap.ts",
      "app/robots.ts",
      "app/opengraph-image.tsx",
    ];

    expect(packageJson).not.toMatch(/@vercel\/og|axios|sentry/i);

    for (const filePath of runtimeFiles) {
      const source = readProjectFile(filePath);
      expect(source).not.toMatch(/\bfetch\s*\(|GITHUB_TOKEN|github\.com/i);
      expect(source).not.toContain("/Users/");
    }

    const publicFiles = [
      "app/page.tsx",
      "components/layout/site-header.tsx",
      "components/layout/site-footer.tsx",
      "features/home/content.ts",
      "features/projects/components/project-card.tsx",
      "features/component-catalog/components/component-card.tsx",
      "features/guides/components/guide-card.tsx",
    ];
    for (const filePath of publicFiles) {
      const source = readProjectFile(filePath);
      expect(source).not.toContain('href="#"');
    }
  });
});
