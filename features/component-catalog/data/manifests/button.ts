import type { ComponentManifest } from "../../contracts/component-manifest";

export const buttonManifest = {
  slug: "button",
  name: "Button",
  summary: "A native button with clear visual variants and controlled busy states.",
  description:
    "Button provides a native button element for common actions while preserving familiar browser behavior and caller-supplied button attributes.",
  category: "action",
  status: "foundation",
  technologies: ["React", "TypeScript"],
  capabilities: [
    "Offers primary, secondary, ghost, and danger variants.",
    "Offers small, medium, and large sizes.",
    "Supports disabled and loading states.",
    "Sets aria-busy while loading and accepts native button properties.",
  ],
  limitations: [
    "Does not manage asynchronous work itself.",
    "The calling feature controls loading state at the smallest necessary client boundary.",
  ],
  accessibility:
    "Renders a native button. Loading exposes aria-busy and prevents additional activation until the caller clears that state.",
  serverCompatible: true,
  sourcePath: "components/ui/button.tsx",
  featured: true,
  source: { kind: "local" },
} as const satisfies ComponentManifest;
