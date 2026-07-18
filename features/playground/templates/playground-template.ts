import type { PlaygroundSource } from "../types";

export interface PlaygroundTemplate extends PlaygroundSource {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}
