import type { ComponentManifest } from "../../contracts/component-manifest";

export const containerManifest = {
  slug: "container",
  name: "Container",
  summary: "A page-width primitive that keeps content within consistent safe gutters.",
  description:
    "Container standardizes readable page widths and horizontal safety gutters without imposing business layout or content behavior.",
  category: "layout",
  status: "foundation",
  technologies: ["React", "TypeScript"],
  capabilities: [
    "Offers content, default, wide, and full width modes.",
    "Applies the shared page maximum widths and responsive gutters.",
    "Supports a semantic wrapper element through the as property.",
  ],
  limitations: [
    "Does not define a business-specific grid or page structure.",
    "Does not add landmarks, headings, or content semantics automatically.",
  ],
  accessibility:
    "Callers can select a semantic wrapper with as and remain responsible for choosing landmarks and heading structure that fit the page.",
  serverCompatible: true,
  sourcePath: "components/ui/container.tsx",
  featured: true,
  source: { kind: "local" },
} as const satisfies ComponentManifest;
