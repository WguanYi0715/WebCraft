# WebCraft

WebCraft is a portfolio-oriented development platform for presenting projects,
reusable interface components, practical engineering guides, and safe
browser-based code experiments. It is built as an expandable Next.js
application with clear data boundaries, a documented design system, and a
verification-first engineering baseline.

## Live demo

Live demo: [Open WebCraft](https://webcraft.guanyilab.com)

## What WebCraft includes

- A curated project catalogue backed by trusted local manifests.
- A component catalogue with live, reusable interface primitives.
- Structured development guides with static, author-maintained content.
- A browser playground for small HTML, CSS, and JavaScript experiments.
- Shared navigation, metadata, error handling, robots, sitemap, and Open
  Graph foundations.

## Core product modules

### Projects

Projects are described by local manifests and adapted into a single stable
model before they reach pages or components. This keeps display data explicit
and avoids treating an unverified external response as product content.

### Component catalogue

The catalogue presents the project's Button, Badge, Card, and Container
primitives through a common manifest, adapter, and preview flow. The design
system preview and the user-facing catalogue serve different purposes while
sharing the same verified component implementations.

### Guides

Guides use structured local content and adapters rather than arbitrary
Markdown or remote article rendering. The current content model is designed to
remain understandable and safe as the guide library grows.

### Playground

The Playground provides trusted starter templates and runs authored HTML, CSS,
and JavaScript in a sandboxed iframe. Drafts remain in the browser, share links
store source in the URL hash, and the application does not provide cloud
storage, package installation, server-side execution, or unrestricted network
access from the preview.

## Technical architecture

WebCraft uses the Next.js App Router with React and TypeScript. Product data is
kept in local, trusted manifests, then transformed through explicit adapters
into stable models for projects, components, and guides. Route metadata,
canonical URLs, sitemap entries, robots configuration, and the generated Open
Graph image share a single site configuration layer.

## Design system

The interface is organised around reusable tokens, material layers, component
primitives, and motion rules. Surface, Mist, Glass, and Crystal materials give
the product a consistent visual hierarchy while keeping content legible and
interactive controls clear.

## Security model

- Public site URLs are validated server-side before they are used for metadata,
  sitemap, or robots output.
- Baseline response headers include content-type, referrer, and permissions
  protections.
- The Playground uses an `allow-scripts` iframe sandbox and a separate strict
  Content Security Policy; its preview does not load external dependencies or
  connect to the network.
- Playground drafts are local browser state and are not suitable for sensitive
  information.

## Quality and verification

The project currently has 64 automated tests covering product data contracts,
routes, metadata, security behaviour, and the Playground. The standard quality
gate runs linting, TypeScript checks, tests, and a production build:

```bash
pnpm check
```

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- pnpm 11

## Local development

WebCraft requires Node.js `>=22 <23` and pnpm `11.12.0`.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

`SITE_URL` is used only by server-side metadata, sitemap, and robots output.
Copy the safe local default from `.env.example` and set a real HTTPS URL when a
production domain is connected.

## Project structure

```text
app/         Routes, layouts, metadata, and error boundaries
components/  Reusable layout and UI primitives
features/    Project, component, guide, and playground modules
lib/         Shared configuration and navigation utilities
schemas/     Shared validation boundaries
server/      Server-side module boundary
styles/      Tokens, materials, motion, and page styles
tests/       Automated product and production-readiness checks
types/       Shared TypeScript types
```

## Current status

WebCraft is in an actively developed foundation phase. Its current product
surface is intentionally local-first: it does not yet include accounts, a
database, analytics, remote repository integration, or cloud-hosted user
content.

## Roadmap

- Expand the verified project, component, and guide catalogues.
- Continue strengthening the local data contracts before introducing external
  integrations.
- Connect a stable public repository and production demonstration.

## Author

Portfolio: [WguanYi0715](https://github.com/WguanYi0715)
