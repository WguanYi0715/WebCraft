import { Badge } from "@/components/ui";
import type { ComponentStatus as ComponentStatusType } from "../types";

const statusPresentation: Record<
  ComponentStatusType,
  { label: string; variant: "accent" | "success" | "warning" | "neutral" }
> = {
  foundation: { label: "Foundation", variant: "accent" },
  stable: { label: "Stable", variant: "success" },
  experimental: { label: "Experimental", variant: "warning" },
  deprecated: { label: "Deprecated", variant: "neutral" },
};

export interface ComponentStatusProps {
  status: ComponentStatusType;
}

export function ComponentStatus({ status }: ComponentStatusProps) {
  const presentation = statusPresentation[status];

  return (
    <Badge variant={presentation.variant}>
      <span className="component-catalog-status__label">Status:</span> {presentation.label}
    </Badge>
  );
}
