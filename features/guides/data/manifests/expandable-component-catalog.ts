import type { GuideManifest } from "../../contracts/guide-manifest";

export const expandableComponentCatalogManifest = {
  slug: "expandable-component-catalog",
  title: "Designing an Expandable Component Catalog",
  summary:
    "Keep real UI implementations separate from their catalog data so new components join one dependable presentation path.",
  description:
    "A guide to the component catalog already used by WebCraft: its source manifests, local adapter, registry, standardized model, and static previews.",
  category: "components",
  difficulty: "intermediate",
  technologies: ["Next.js", "React", "TypeScript"],
  estimatedMinutes: 9,
  lastUpdated: "2026-07-15",
  featured: true,
  status: "foundation",
  sections: [
    {
      id: "separate-the-ui-from-the-catalog",
      title: "Separate the UI from the catalog",
      paragraphs: [
        "components/ui contains the real Button, Badge, Card, and Container implementations. The component catalog is a separate business module that describes those verified components for people who need to choose and understand them.",
        "This distinction keeps catalog prose, categories, limitations, and routes from leaking into the reusable UI primitives. It also prevents a catalog page from inventing an API that the real component does not provide.",
      ],
    },
    {
      id: "standardize-source-data-before-pages",
      title: "Standardize source data before pages",
      paragraphs: [
        "Each component begins as a ComponentManifest: trusted, hand-maintained source facts such as its name, capabilities, accessibility notes, and source path. A standard Component is the normalized result that pages and catalog business components consume.",
        "The boundary matters even when the two shapes are similar. Future data formats can receive their own adapter, while the list, detail page, metadata, and previews continue to depend on one stable Component model.",
      ],
      codeExamples: [
        {
          title: "Registry built through the local adapter",
          language: "TypeScript",
          description: "The current registry converts each independent manifest before exposing the catalog collection.",
          code: `export const components = [
  adaptLocalComponent(buttonManifest),
  adaptLocalComponent(badgeManifest),
  adaptLocalComponent(cardManifest),
  adaptLocalComponent(containerManifest),
] as const satisfies readonly Component[];`,
        },
      ],
    },
    {
      id: "use-an-adapter-and-registry",
      title: "Use an adapter and registry",
      paragraphs: [
        "The Local Adapter is a pure function. It copies scalar fields and clones technologies, capabilities, and limitations so a page never receives a mutable reference to the manifest source.",
        "The Registry collects normalized components in one place. Query helpers return copied results by slug, category, or featured state, which keeps read-only catalog data from becoming accidental page state.",
      ],
      codeExamples: [
        {
          title: "Slug query",
          language: "TypeScript",
          description: "Pages use a normalized query instead of reading a manifest directly.",
          code: `export function getComponentBySlug(slug: string): Component | undefined {
  const component = components.find((entry) => entry.slug === slug);

  return component ? copyComponent(component) : undefined;
}`,
        },
      ],
    },
    {
      id: "preview-real-components",
      title: "Preview real components",
      paragraphs: [
        "A catalog preview imports the existing UI component and renders a restrained static example. Button previews use its real variants and states; Card previews use its real materials; no generated markup or executable example is introduced.",
        "Reusing the real component prevents the documentation from drifting. It also makes limits visible: the catalog can describe a native button or a composable card without pretending it has a package install flow, a remote API, or abilities that are not implemented.",
      ],
    },
    {
      id: "add-components-with-evidence",
      title: "Add components with evidence",
      paragraphs: [
        "To add a component, first implement and verify its real UI contract in components/ui. Then add one manifest, adapt it into the Registry, provide a preview that uses the real component, and extend the relevant contract tests.",
        "Do not add a catalog entry only because a component is planned. Keeping unimplemented capabilities out of the registry avoids duplicate implementations, stale documentation, and misleading product claims.",
      ],
    },
  ],
  source: { kind: "local" },
} as const satisfies GuideManifest;
