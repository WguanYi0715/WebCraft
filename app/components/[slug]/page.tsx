import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import {
  ComponentDetail,
  getAllComponents,
  getComponentBySlug,
} from "@/features/component-catalog";
import { createPageMetadata } from "@/lib/site-config";

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllComponents().map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {};
  }

  return createPageMetadata({
    title: `${component.name} | Components`,
    description: component.summary,
    path: `/components/${component.slug}`,
  });
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <section aria-label={`${component.name} component details`} className="component-catalog-page">
      <Container size="content">
        <ComponentDetail component={component} />
      </Container>
    </section>
  );
}
