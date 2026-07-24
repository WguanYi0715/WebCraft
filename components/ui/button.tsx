import type { ComponentPropsWithRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "disabled"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  ref,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = [
    "wc-button",
    "wc-motion-scale",
    `wc-button--${variant}`,
    `wc-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={classes}
      disabled={isDisabled}
      ref={ref}
      type={type}
    >
      {loading ? (
        <>
          <span aria-hidden="true" className="wc-button__spinner" />
          <span className="wc-button__loading-status">Loading</span>
        </>
      ) : null}
      <span className="wc-button__label">{children}</span>
    </button>
  );
}
