export type NavigationHref =
  | "/"
  | "/projects"
  | "/components"
  | "/guides"
  | "/playground"
  | "/design-system";

export interface NavigationItem {
  href: NavigationHref;
  label: string;
}

export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/components", label: "Components" },
  { href: "/guides", label: "Guides" },
  { href: "/playground", label: "Playground" },
  { href: "/design-system", label: "Design System" },
] as const satisfies readonly NavigationItem[];
