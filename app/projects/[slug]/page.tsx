import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { ProjectDetail, getProjectBySlug, getPublicProjects } from "@/features/projects";
import { createPageMetadata } from "@/lib/site-config";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublicProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.visibility !== "public") {
    return {};
  }

  return createPageMetadata({
    title: `${project.name} | Projects`,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.visibility !== "public") {
    notFound();
  }

  return (
    <section className="projects-page" aria-label={`${project.name} project details`}>
      <Container size="content">
        <ProjectDetail project={project} />
      </Container>
    </section>
  );
}
