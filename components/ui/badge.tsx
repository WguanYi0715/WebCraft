import type { ComponentPropsWithoutRef } from "react";

export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  const classes = ["wc-badge", `wc-badge--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return <span {...props} className={classes} />;
}
