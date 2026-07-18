import type { ComponentCategory, ComponentStatus } from "../types";

/**
 * Trusted, hand-maintained facts used to register one local UI component.
 * Pages never consume this source shape directly.
 */
export interface ComponentManifest {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly description: string;
  readonly category: ComponentCategory;
  readonly status: ComponentStatus;
  readonly technologies: readonly string[];
  readonly capabilities: readonly string[];
  readonly limitations: readonly string[];
  readonly accessibility: string;
  readonly serverCompatible: boolean;
  readonly sourcePath: string;
  readonly featured: boolean;
  readonly source: {
    readonly kind: "local";
  };
}
