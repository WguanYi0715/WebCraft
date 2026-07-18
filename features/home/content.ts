export interface HomePillar {
  description: string;
  href?: "/projects" | "/components" | "/guides" | "/playground";
  status: "Foundation" | "Planned" | "Coming later";
  title: string;
}

export interface FoundationItem {
  description: string;
  title: string;
}

export interface GrowthStep {
  description: string;
  title: string;
}

export const homeHero = {
  description:
    "WebCraft brings projects, components, guides, and verified full-stack patterns into one expandable development platform.",
  status: "Foundation phase · Active development",
  title: "Build the web with clarity, precision, and flow.",
} as const;

export const platformPillars: readonly HomePillar[] = [
  {
    title: "Projects",
    description: "Curated GitHub projects, ready to be understood in context.",
    href: "/projects",
    status: "Foundation",
  },
  {
    title: "Components",
    description: "Reusable, verified interface building blocks with clear contracts.",
    href: "/components",
    status: "Foundation",
  },
  {
    title: "Guides",
    description: "Complete development guidance that stays grounded in real practice.",
    href: "/guides",
    status: "Foundation",
  },
  {
    title: "Playground",
    description: "A focused workspace for running, testing, and shaping code.",
    href: "/playground",
    status: "Foundation",
  },
] as const;

export const foundationItems: readonly FoundationItem[] = [
  {
    title: "Expandable Architecture",
    description:
      "Clear directories and module boundaries leave room for future GitHub project integration without pre-building unused features.",
  },
  {
    title: "Fluid Interface",
    description:
      "Shared design tokens, material levels, motion rules, and responsive foundations create a coherent interface language.",
  },
  {
    title: "Reliable Full Stack",
    description:
      "Clear product boundaries are paired with tests, builds, security headers, and CI quality checks.",
  },
] as const;

export const growthSteps: readonly GrowthStep[] = [
  {
    title: "Repository",
    description: "A GitHub project or local development resource enters with its own context.",
  },
  {
    title: "Contract",
    description: "Standardized data, types, schemas, and API contracts make its boundaries explicit.",
  },
  {
    title: "Experience",
    description: "A unified, precise, and fluid interface turns that structure into a useful product experience.",
  },
] as const;
