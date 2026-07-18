import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Project not found",
  description: "The requested project is not available.",
};

export default function ProjectNotFound() {
  return (
    <section className="projects-page" aria-labelledby="project-not-found-title">
      <Container size="content">
        <div className="projects-not-found wc-surface">
          <p className="projects-page__eyebrow">Projects</p>
          <h1 id="project-not-found-title">This project is not available</h1>
          <p>The project may not exist or is not available for public viewing.</p>
          <Link className="projects-link" href="/projects">
            Return to Projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
