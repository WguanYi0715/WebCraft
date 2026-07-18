import { adaptLocalComponent } from "../adapters";
import type { Component } from "../types";
import { badgeManifest } from "./manifests/badge";
import { buttonManifest } from "./manifests/button";
import { cardManifest } from "./manifests/card";
import { containerManifest } from "./manifests/container";

/** The read-only catalog registry used by all component catalog consumers. */
export const components = [
  adaptLocalComponent(buttonManifest),
  adaptLocalComponent(badgeManifest),
  adaptLocalComponent(cardManifest),
  adaptLocalComponent(containerManifest),
] as const satisfies readonly Component[];
