import type { ComponentManifest } from "../../contracts/component-manifest";

export const cardManifest = {
  slug: "card",
  name: "Card",
  summary: "A composable content container with deliberate material and hover choices.",
  description:
    "Card groups related content through a small composition API while keeping its visual material and interactive emphasis explicit.",
  category: "display",
  status: "foundation",
  technologies: ["React", "TypeScript"],
  capabilities: [
    "Composes Card, CardHeader, CardTitle, CardDescription, CardContent, and CardFooter.",
    "Supports Surface, Mist, and Glass materials, with Surface as the default.",
    "Applies hover emphasis only when hoverable is explicitly enabled.",
  ],
  limitations: [
    "Does not add navigation or click behavior by itself.",
    "Does not use a high-emphasis material as a normal card default.",
  ],
  accessibility:
    "Renders neutral container elements. Callers provide appropriate headings, surrounding landmarks, and interactive controls when needed.",
  serverCompatible: true,
  sourcePath: "components/ui/card.tsx",
  featured: true,
  source: { kind: "local" },
} as const satisfies ComponentManifest;
