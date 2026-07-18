import { adaptLocalGuide } from "../adapters";
import type { Guide } from "../types";
import { expandableComponentCatalogManifest } from "./manifests/expandable-component-catalog";
import { reliableNextjsFoundationManifest } from "./manifests/reliable-nextjs-foundation";

/** The read-only local guide registry used by all Guides consumers. */
export const guides = [
  adaptLocalGuide(reliableNextjsFoundationManifest),
  adaptLocalGuide(expandableComponentCatalogManifest),
] as const satisfies readonly Guide[];
