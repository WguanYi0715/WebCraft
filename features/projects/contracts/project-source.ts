export type ProjectSourceKind = "local" | "github";

export interface ProjectSource {
  readonly kind: ProjectSourceKind;
}

export interface LocalProjectSource extends ProjectSource {
  readonly kind: "local";
}
