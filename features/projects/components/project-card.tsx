import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { Project } from "../types";
import { ProjectStatus } from "./project-status";
import { ProjectTechnologyList } from "./project-technology-list";

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="projects-card">
      <Card className="projects-card__panel" hoverable material="surface">
        <CardHeader className="projects-card__header">
          <ProjectStatus status={project.status} />
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="projects-card__content">
          <ProjectTechnologyList
            label={`${project.name} technologies`}
            technologies={project.technologies}
          />
        </CardContent>
        <CardFooter className="projects-card__footer">
          <Link className="projects-link" href={`/projects/${project.slug}`}>
            View project
            <span aria-hidden="true">→</span>
          </Link>
        </CardFooter>
      </Card>
    </article>
  );
}
