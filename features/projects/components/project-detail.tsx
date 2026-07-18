import Link from "next/link";
import { Card } from "@/components/ui";
import type { Project } from "../types";
import { ProjectStatus } from "./project-status";
import { ProjectTechnologyList } from "./project-technology-list";

export interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article aria-labelledby="project-title" className="projects-detail">
      <Card className="projects-detail__panel" material="surface">
        <header className="projects-detail__header">
          <ProjectStatus status={project.status} />
          <h1 id="project-title">{project.name}</h1>
          <p>{project.description}</p>
        </header>

        <div className="projects-detail__body">
          <section aria-labelledby="project-technologies-title">
            <h2 id="project-technologies-title">Technology stack</h2>
            <ProjectTechnologyList
              label={`${project.name} technologies`}
              technologies={project.technologies}
            />
          </section>

          {project.version || project.lastUpdated ? (
            <dl className="projects-detail__facts">
              {project.version ? (
                <div>
                  <dt>Current version</dt>
                  <dd>{project.version}</dd>
                </div>
              ) : null}
              {project.lastUpdated ? (
                <div>
                  <dt>Last updated</dt>
                  <dd>
                    <time dateTime={project.lastUpdated}>{project.lastUpdated}</time>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <section aria-labelledby="project-features-title">
            <h2 id="project-features-title">Current capabilities</h2>
            <ul className="projects-detail__feature-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="projects-detail__footer">
          <Link className="projects-link projects-link--secondary" href="/projects">
            Back to Projects
          </Link>
          {project.repositoryUrl || project.demoUrl ? (
            <div className="projects-detail__actions">
              {project.repositoryUrl ? (
                <a
                  className="projects-link"
                  href={project.repositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  View repository
                </a>
              ) : null}
              {project.demoUrl ? (
                <a
                  className="projects-link"
                  href={project.demoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open demo
                </a>
              ) : null}
            </div>
          ) : null}
        </footer>
      </Card>
    </article>
  );
}
