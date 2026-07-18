import { Badge, type BadgeVariant } from "@/components/ui";
import type { ProjectStatus as ProjectStatusType } from "../types";

const statusConfig: Record<ProjectStatusType, { label: string; variant: BadgeVariant }> = {
  foundation: { label: "Foundation", variant: "info" },
  active: { label: "Active", variant: "accent" },
  stable: { label: "Stable", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  archived: { label: "Archived", variant: "neutral" },
};

export interface ProjectStatusProps {
  status: ProjectStatusType;
}

export function ProjectStatus({ status }: ProjectStatusProps) {
  const { label, variant } = statusConfig[status];

  return (
    <Badge className="projects-status" variant={variant}>
      <span className="projects-status__label">Status:</span> {label}
    </Badge>
  );
}
