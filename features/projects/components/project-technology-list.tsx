import { Badge } from "@/components/ui";

export interface ProjectTechnologyListProps {
  technologies: readonly string[];
  label: string;
}

export function ProjectTechnologyList({
  technologies,
  label,
}: ProjectTechnologyListProps) {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <ul aria-label={label} className="projects-technology-list">
      {technologies.map((technology) => (
        <li key={technology}>
          <Badge variant="neutral">{technology}</Badge>
        </li>
      ))}
    </ul>
  );
}
