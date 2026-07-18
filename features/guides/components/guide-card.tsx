import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { Guide } from "../types";
import { GuideMetadata } from "./guide-metadata";

export interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="guides-card">
      <Card className="guides-card__panel" hoverable material="surface">
        <CardHeader className="guides-card__header">
          <GuideMetadata guide={guide} />
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription>{guide.summary}</CardDescription>
        </CardHeader>
        <CardContent className="guides-card__content">
          <p>{guide.description}</p>
        </CardContent>
        <CardFooter className="guides-card__footer">
          <Link className="guides-link" href={`/guides/${guide.slug}`}>
            Read guide
            <span aria-hidden="true">→</span>
          </Link>
        </CardFooter>
      </Card>
    </article>
  );
}
