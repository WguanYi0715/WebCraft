import { adaptLocalProject } from "../adapters";
import { webcraftManifest } from "./manifests/webcraft";
import type { Project } from "../types";

export const projects = [
  adaptLocalProject(webcraftManifest),
] as const satisfies readonly Project[];
