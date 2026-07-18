import type { GuideManifest } from "../../contracts/guide-manifest";

export const reliableNextjsFoundationManifest = {
  slug: "reliable-nextjs-foundation",
  title: "Building a Reliable Next.js Foundation",
  summary:
    "Use clear rules, stable directories, and one repeatable quality chain before expanding a Next.js application.",
  description:
    "A practical account of the foundations already established in WebCraft, with emphasis on constraints that keep later features understandable and verifiable.",
  category: "foundation",
  difficulty: "beginner",
  technologies: ["Next.js", "TypeScript", "Vitest", "GitHub Actions"],
  estimatedMinutes: 8,
  lastUpdated: "2026-07-15",
  featured: true,
  status: "foundation",
  sections: [
    {
      id: "start-with-rules-and-directories",
      title: "Start with rules and directories",
      paragraphs: [
        "A reliable foundation begins by deciding where responsibilities live before a feature needs them. In WebCraft, routes stay in app, reusable primitives stay in components, and business-specific behavior stays in features.",
        "This is not the only valid architecture. It is a small boundary that makes the next addition easier to locate, review, test, and remove if the direction changes.",
      ],
    },
    {
      id: "treat-rules-as-working-contracts",
      title: "Treat rules as working contracts",
      paragraphs: [
        "Project conventions define scope, safety, and validation expectations before a change begins. They make interface, service, data, and security responsibilities explicit without coupling the product to one development workflow.",
        "Clear conventions separate task boundaries, interface quality, accessibility, service behavior, data handling, and security concerns. Reviewing the relevant constraints before a change prevents accidental scope expansion.",
      ],
    },
    {
      id: "keep-one-quality-chain",
      title: "Keep one quality chain",
      paragraphs: [
        "WebCraft uses pnpm check as the local quality chain. It runs linting, type checking, Vitest, and the production build in a defined order, so a passing result covers more than a single editor check.",
        "Vitest protects stable contracts such as route availability, data boundaries, design-system reuse, and security-header configuration. GitHub Actions runs the same pnpm check command for pushes and pull requests that target main.",
      ],
      codeExamples: [
        {
          title: "Quality script",
          language: "JSON",
          description: "The current package script composes the project checks without adding a separate toolchain.",
          code: `{
  "scripts": {
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}`,
        },
        {
          title: "CI quality step",
          language: "YAML",
          description: "The repository workflow delegates its final verification step to the same local command.",
          code: `- name: Run quality checks
  run: pnpm check`,
        },
      ],
    },
    {
      id: "keep-environment-and-browser-boundaries-clear",
      title: "Keep environment and browser boundaries clear",
      paragraphs: [
        "The current project does not require environment variables. When one becomes necessary, its public name and purpose belong in .env.example, while real values remain in .env.local and out of version control.",
        "The application also configures X-Content-Type-Options, Referrer-Policy, and Permissions-Policy as baseline response headers. These are small, concrete safeguards rather than a substitute for feature-specific security decisions.",
      ],
      codeExamples: [
        {
          title: "Configured baseline headers",
          language: "TypeScript",
          description: "These values are defined in the current Next.js configuration.",
          code: `const headers = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];`,
        },
      ],
    },
    {
      id: "defer-complexity-until-it-is-real",
      title: "Defer complexity until it is real",
      paragraphs: [
        "A database, login system, microservice boundary, or external API is useful only when an actual requirement needs it. Adding one early creates operational, security, and testing work before the product has data or users that require it.",
        "For the current foundation, trusted local data and static server-compatible pages keep the core experience available while later modules can introduce stronger runtime validation or services when their inputs become external.",
      ],
    },
  ],
  source: { kind: "local" },
} as const satisfies GuideManifest;
