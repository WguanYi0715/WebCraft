import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { Component } from "../types";
import { ComponentStatus } from "./component-status";

export interface ComponentCardProps {
  component: Component;
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <article className="component-catalog-card">
      <Card className="component-catalog-card__panel" hoverable material="surface">
        <CardHeader className="component-catalog-card__header">
          <div className="component-catalog-card__meta">
            <ComponentStatus status={component.status} />
            <Badge variant="accent">
              <span className="component-catalog-card__label">Category:</span> {component.category}
            </Badge>
          </div>
          <CardTitle>{component.name}</CardTitle>
          <CardDescription>{component.summary}</CardDescription>
        </CardHeader>
        <CardContent className="component-catalog-card__content">
          <ul aria-label={`${component.name} technologies`} className="component-catalog-card__tags">
            {component.technologies.map((technology) => (
              <li key={technology}>
                <Badge>{technology}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="component-catalog-card__footer">
          <Link className="component-catalog-link" href={`/components/${component.slug}`}>
            View {component.name}
            <span aria-hidden="true">→</span>
          </Link>
        </CardFooter>
      </Card>
    </article>
  );
}
