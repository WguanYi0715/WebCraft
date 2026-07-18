import type { ComponentPropsWithoutRef } from "react";

export type CardMaterial = "surface" | "mist" | "glass";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  material?: CardMaterial;
  hoverable?: boolean;
}

export function Card({
  className,
  material = "surface",
  hoverable = false,
  ...props
}: CardProps) {
  const classes = [
    "wc-card",
    "wc-motion-material",
    `wc-${material}`,
    hoverable ? "wc-card--hoverable" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div {...props} className={classes} />;
}

export function CardHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={["wc-card__header", className].filter(Boolean).join(" ")} />;
}

export function CardTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return <h3 {...props} className={["wc-card__title", className].filter(Boolean).join(" ")} />;
}

export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={["wc-card__description", className].filter(Boolean).join(" ")} />;
}

export function CardContent({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={["wc-card__content", className].filter(Boolean).join(" ")} />;
}

export function CardFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={["wc-card__footer", className].filter(Boolean).join(" ")} />;
}
