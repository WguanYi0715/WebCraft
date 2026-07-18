import type { ComponentManifest } from "../../contracts/component-manifest";

export const badgeManifest = {
  slug: "badge",
  name: "Badge",
  summary: "A compact semantic label for status, tags, and supporting information.",
  description:
    "Badge presents concise contextual information without taking ownership of actions or application state.",
  category: "feedback",
  status: "foundation",
  technologies: ["React", "TypeScript"],
  capabilities: [
    "Offers neutral, accent, success, warning, danger, and info appearances.",
    "Supports status labels, technology tags, and short supporting information.",
    "Keeps status text visible so meaning is not conveyed by color alone.",
  ],
  limitations: [
    "Does not provide button or link behavior.",
    "Does not manage the state that a label describes.",
  ],
  accessibility:
    "Uses readable text inside a span. Status meaning must remain explicit in its label, not depend on appearance alone.",
  serverCompatible: true,
  sourcePath: "components/ui/badge.tsx",
  featured: true,
  source: { kind: "local" },
} as const satisfies ComponentManifest;
