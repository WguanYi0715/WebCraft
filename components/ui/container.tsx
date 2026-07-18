import type { ComponentPropsWithoutRef, ElementType } from "react";

export type ContainerSize = "content" | "default" | "wide" | "full";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  as?: ElementType;
  size?: ContainerSize;
}

export function Container({
  as: Component = "div",
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const classes = ["wc-container", `wc-container--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return <Component {...props} className={classes} />;
}
