import type { ProjectManifest } from "../../contracts/project-manifest";

export const webcraftManifest = {
  source: { kind: "local" },
  slug: "webcraft",
  name: "WebCraft",
  shortDescription: "An expandable frontend and backend web development platform.",
  description:
    "WebCraft is an expandable frontend and backend web development platform. It is currently in its foundation phase and remains in active development, with quality boundaries, a design system, an application shell, a formal home page, tests, CI, and baseline security already in place.",
  status: "foundation",
  technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vitest"],
  features: [
    "Quality boundaries and verification",
    "A shared design system and application shell",
    "A formal home page and static project foundation",
    "Tests, CI, and baseline security headers",
  ],
  version: "0.1.0",
  featured: true,
  visibility: "public",
} as const satisfies ProjectManifest;
