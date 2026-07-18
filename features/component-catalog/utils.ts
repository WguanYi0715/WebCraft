import { components } from "./data/components";
import type { Component, ComponentCategory } from "./types";

function copyComponent(component: Component): Component {
  return {
    ...component,
    technologies: [...component.technologies],
    capabilities: [...component.capabilities],
    limitations: [...component.limitations],
  };
}

/** Returns copies so callers cannot mutate the catalog registry. */
export function getAllComponents(): readonly Component[] {
  return components.map(copyComponent);
}

export function getComponentBySlug(slug: string): Component | undefined {
  const component = components.find((entry) => entry.slug === slug);

  return component ? copyComponent(component) : undefined;
}

export function getComponentsByCategory(
  category: ComponentCategory,
): readonly Component[] {
  return getAllComponents().filter((component) => component.category === category);
}

export function getFeaturedComponents(): readonly Component[] {
  return getAllComponents().filter((component) => component.featured);
}
