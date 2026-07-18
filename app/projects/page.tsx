import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { ProjectCard, getPublicProjects } from "@/features/projects";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description: "Verified project foundations and their current development context.",
  path: "/projects",
});

export default function ProjectsPage() {
  const publicProjects = getPublicProjects();
  const projectCount = publicProjects.length;

  return (
    <section className="projects-page" aria-labelledby="projects-title">
      <Container size="default">
        <header className="projects-page__header">
          <p className="projects-page__eyebrow">Projects</p>
          <h1 id="projects-title">Projects with clear foundations</h1>
          <p>
            Each project is registered through the same trusted model, so its status,
            capabilities, and next steps stay easy to understand.
          </p>
          <p className="projects-page__count wc-mist" role="status">
            {projectCount} public {projectCount === 1 ? "project" : "projects"}
          </p>
        </header>

        {projectCount > 0 ? (
          <ul className="projects-grid" role="list">
            {publicProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="projects-empty wc-mist" role="status">
            <h2>No public projects yet</h2>
            <p>Verified projects will appear here once they are ready to be shared.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
