import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { primaryNavigation } from "../lib/navigation";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const requiredFiles = [
  ".env.example",
  "app/page.tsx",
  "package.json",
];

const requiredScripts = ["dev", "lint", "typecheck", "build", "test", "check"];

const designSystemFiles = [
  "styles/tokens.css",
  "styles/materials.css",
  "styles/motion.css",
];

const componentFiles = [
  "components/ui/button.tsx",
  "components/ui/badge.tsx",
  "components/ui/card.tsx",
  "components/ui/container.tsx",
];

const layoutFiles = [
  "components/layout/app-shell.tsx",
  "components/layout/site-header.tsx",
  "components/layout/site-footer.tsx",
  "components/layout/skip-link.tsx",
];

const homeFiles = [
  "features/home/components/hero-section.tsx",
  "features/home/components/platform-pillars.tsx",
  "features/home/components/foundation-section.tsx",
  "features/home/components/growth-flow.tsx",
  "features/home/components/final-cta.tsx",
];

const requiredSecurityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

function isIgnoredByGit(filePath: string) {
  return (
    spawnSync("git", ["check-ignore", "--no-index", "-q", filePath], {
      cwd: projectRoot,
    }).status === 0
  );
}

describe("project foundation", () => {
  it("keeps the required project foundation files", () => {
    for (const filePath of requiredFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }
  });

  it("keeps the required project scripts", () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      scripts?: Record<string, string>;
    };

    for (const scriptName of requiredScripts) {
      expect(packageJson.scripts?.[scriptName]).toEqual(expect.any(String));
    }
  });

  it("protects environment files and configures security headers", async () => {
    expect(isIgnoredByGit(".env.example")).toBe(false);
    expect(isIgnoredByGit(".env.local")).toBe(true);

    const headerRules = await nextConfig.headers?.();
    const globalHeaderRule = headerRules?.find(
      (headerRule) => headerRule.source === "/:path*",
    );

    expect(globalHeaderRule?.headers).toEqual(
      expect.arrayContaining(requiredSecurityHeaders),
    );
  });

  it("keeps the design system foundation", () => {
    for (const filePath of designSystemFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );
    const tokens = readFileSync(path.join(projectRoot, "styles/tokens.css"), "utf8");
    const materials = readFileSync(
      path.join(projectRoot, "styles/materials.css"),
      "utf8",
    );
    const motion = readFileSync(path.join(projectRoot, "styles/motion.css"), "utf8");

    for (const fileName of ["tokens.css", "materials.css", "motion.css"]) {
      expect(globalStyles).toContain(`@import "../styles/${fileName}"`);
    }

    for (const materialClass of [
      "wc-surface",
      "wc-mist",
      "wc-glass",
      "wc-crystal",
    ]) {
      expect(materials).toContain(`.${materialClass}`);
    }

    expect(tokens).toContain(":root");
    expect(tokens).toMatch(/\[data-theme="dark"\][\s\S]*--wc-color-page:/);
    expect(motion).toContain("--wc-duration-micro");
    expect(motion).toContain("prefers-reduced-motion");
  });

  it("keeps the shared component foundation", () => {
    for (const filePath of componentFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const componentIndex = readFileSync(
      path.join(projectRoot, "components/ui/index.ts"),
      "utf8",
    );
    const button = readFileSync(
      path.join(projectRoot, "components/ui/button.tsx"),
      "utf8",
    );
    const card = readFileSync(
      path.join(projectRoot, "components/ui/card.tsx"),
      "utf8",
    );
    const componentStyles = readFileSync(
      path.join(projectRoot, "styles/components.css"),
      "utf8",
    );

    for (const componentName of ["Badge", "Button", "Card", "Container"]) {
      expect(componentIndex).toMatch(
        new RegExp(`export\\s*\\{[\\s\\S]*?\\b${componentName}\\b`),
      );
    }

    for (const variant of ["primary", "secondary", "ghost", "danger"]) {
      expect(button).toContain(`"${variant}"`);
    }

    for (const size of ["small", "medium", "large"]) {
      expect(button).toContain(`"${size}"`);
    }

    expect(button).toContain("aria-busy");
    expect(card).toMatch(
      /CardMaterial = "surface" \| "mist" \| "glass"/,
    );
    expect(card).not.toMatch(/["']crystal["']/);
    expect(existsSync(path.join(projectRoot, "app/design-system/page.tsx"))).toBe(
      true,
    );
    expect(componentStyles).toContain("var(--wc-color-accent)");
    expect(componentStyles).toContain("var(--wc-space-md)");
    expect(componentStyles).not.toContain("[data-theme");
  });

  it("keeps the shared application shell and real navigation routes", () => {
    for (const filePath of layoutFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const layoutIndex = readFileSync(
      path.join(projectRoot, "components/layout/index.ts"),
      "utf8",
    );
    const appShell = readFileSync(
      path.join(projectRoot, "components/layout/app-shell.tsx"),
      "utf8",
    );
    const siteHeader = readFileSync(
      path.join(projectRoot, "components/layout/site-header.tsx"),
      "utf8",
    );
    const siteFooter = readFileSync(
      path.join(projectRoot, "components/layout/site-footer.tsx"),
      "utf8",
    );
    const rootLayout = readFileSync(
      path.join(projectRoot, "app/layout.tsx"),
      "utf8",
    );
    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );

    for (const componentName of [
      "AppShell",
      "SiteHeader",
      "SiteFooter",
      "SkipLink",
    ]) {
      expect(layoutIndex).toContain(componentName);
    }

    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/projects",
      "/components",
      "/guides",
      "/playground",
      "/design-system",
    ]);
    expect(existsSync(path.join(projectRoot, "app/page.tsx"))).toBe(true);
    expect(
      existsSync(path.join(projectRoot, "app/design-system/page.tsx")),
    ).toBe(true);
    expect(rootLayout).toContain("<AppShell>");
    expect(appShell).toContain("<SkipLink");
    expect(appShell).toContain('id="main-content"');
    expect(appShell).toContain("<SiteHeader");
    expect(appShell).toContain("<SiteFooter");
    expect(siteHeader).toContain("wc-glass");
    expect(siteFooter).not.toContain("wc-crystal");
    expect(globalStyles).toContain('@import "../styles/layout.css"');

    for (const filePath of layoutFiles) {
      const fileContent = readFileSync(path.join(projectRoot, filePath), "utf8");
      expect(fileContent).not.toContain('"use client"');
    }
  });

  it("keeps the static home page structure and its extension boundaries", () => {
    for (const filePath of homeFiles) {
      expect(existsSync(path.join(projectRoot, filePath))).toBe(true);
    }

    const homeIndex = readFileSync(
      path.join(projectRoot, "features/home/index.ts"),
      "utf8",
    );
    const homePage = readFileSync(path.join(projectRoot, "app/page.tsx"), "utf8");
    const hero = readFileSync(
      path.join(projectRoot, "features/home/components/hero-section.tsx"),
      "utf8",
    );
    const homeContent = readFileSync(
      path.join(projectRoot, "features/home/content.ts"),
      "utf8",
    );
    const foundation = readFileSync(
      path.join(projectRoot, "features/home/components/foundation-section.tsx"),
      "utf8",
    );
    const finalCta = readFileSync(
      path.join(projectRoot, "features/home/components/final-cta.tsx"),
      "utf8",
    );
    const homeStyles = readFileSync(path.join(projectRoot, "styles/home.css"), "utf8");
    const homeComponentSources = homeFiles
      .map((filePath) => readFileSync(path.join(projectRoot, filePath), "utf8"))
      .join("\n");
    const globalStyles = readFileSync(
      path.join(projectRoot, "app/globals.css"),
      "utf8",
    );

    for (const componentName of [
      "HeroSection",
      "PlatformPillars",
      "FoundationSection",
      "GrowthFlow",
      "FinalCta",
    ]) {
      expect(homeIndex).toContain(componentName);
      expect(homePage).toContain(`<${componentName}`);
    }

    expect(homeContent).toContain(
      "Build the web with clarity, precision, and flow.",
    );
    expect(hero).toContain('href="/design-system"');
    expect(finalCta).toContain('href="/design-system"');
    expect(foundation).toContain('id="foundation"');
    expect(homeComponentSources.match(/<h1/g)).toHaveLength(1);
    expect(homeComponentSources.match(/wc-crystal/g)).toHaveLength(1);
    expect(homeComponentSources).not.toMatch(/href="\/(?!design-system")/);
    expect(homeComponentSources).not.toContain('"use client"');
    expect(globalStyles).toContain('@import "../styles/home.css"');
    expect(globalStyles).toContain('@import "../styles/playground.css"');
    expect(homeStyles).toContain("var(--wc-");
    expect(homeStyles).not.toContain(":root");
    expect(homeStyles).not.toContain("[data-theme");
    expect(homeStyles).not.toContain("@keyframes");
    expect(homeStyles).toContain("scroll-margin-block-start");
  });
});
