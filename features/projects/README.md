# Projects module

Projects use the unified `Project` model in `types.ts`. It is the only model available to pages and business components. A `ProjectManifest` in `contracts/project-manifest.ts` is instead the manually maintained source record for one project.

The current registry imports one independent manifest per project from `data/manifests/` and converts it through `adapters/local-project-adapter.ts`. The adapter copies the standard fields, returns new technology and capability arrays, and preserves genuinely missing optional fields. The registry then exports a read-only collection of normalized `Project` values.

To add a project, create a new verified manifest rather than growing one large data array. Use a unique `slug`, set `visibility`, and omit optional repository, demo, version, or update fields when they are not confirmed; the UI must not render empty actions or facts.

The current source is trusted local TypeScript data. Future GitHub data must pass through a GitHub adapter before becoming `Project`, and external data must receive server-side runtime validation before it reaches the adapter. Pages must never depend on a source format or raw GitHub response.
