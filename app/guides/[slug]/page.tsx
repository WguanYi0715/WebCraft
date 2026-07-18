import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { GuideDetail, getGuideBySlug, getPublishedGuides } from "@/features/guides";
import { createPageMetadata } from "@/lib/site-config";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return createPageMetadata({
    title: `${guide.title} | Guides`,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <section aria-label={`${guide.title} guide`} className="guides-page">
      <Container size="content">
        <GuideDetail guide={guide} />
      </Container>
    </section>
  );
}
