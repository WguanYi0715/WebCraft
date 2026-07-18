import { Badge } from "@/components/ui";
import type { Guide, GuideDifficulty, GuideStatus } from "../types";

const statusPresentation: Record<
  GuideStatus,
  { label: string; variant: "accent" | "success" | "warning" | "neutral" }
> = {
  foundation: { label: "Foundation", variant: "accent" },
  published: { label: "Published", variant: "success" },
  reviewing: { label: "Reviewing", variant: "warning" },
  archived: { label: "Archived", variant: "neutral" },
};

const difficultyPresentation: Record<GuideDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export interface GuideMetadataProps {
  guide: Guide;
}

export function GuideMetadata({ guide }: GuideMetadataProps) {
  const status = statusPresentation[guide.status];

  return (
    <div aria-label={`${guide.title} metadata`} className="guides-metadata">
      <div className="guides-metadata__badges">
        <Badge variant={status.variant}>
          <span className="guides-metadata__label">Status:</span> {status.label}
        </Badge>
        <Badge variant="accent">
          <span className="guides-metadata__label">Category:</span> {guide.category}
        </Badge>
        <Badge>
          <span className="guides-metadata__label">Difficulty:</span>{" "}
          {difficultyPresentation[guide.difficulty]}
        </Badge>
      </div>
      <ul aria-label={`${guide.title} technologies`} className="guides-metadata__technologies">
        {guide.technologies.map((technology) => (
          <li key={technology}>
            <Badge>{technology}</Badge>
          </li>
        ))}
      </ul>
      <p className="guides-metadata__facts">
        <span>{guide.estimatedMinutes} min read</span>
        <span aria-hidden="true">·</span>
        <span>
          Updated <time dateTime={guide.lastUpdated}>{guide.lastUpdated}</time>
        </span>
      </p>
    </div>
  );
}
