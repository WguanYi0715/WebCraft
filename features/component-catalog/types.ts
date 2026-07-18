export type ComponentStatus =
  | "foundation"
  | "stable"
  | "experimental"
  | "deprecated";

export type ComponentCategory =
  | "action"
  | "display"
  | "layout"
  | "feedback"
  | "navigation"
  | "form";

/** The normalized model consumed by component catalog pages and business UI. */
export interface Component {
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
}
