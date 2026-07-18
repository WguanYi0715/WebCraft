import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";
import type { Component } from "../types";

export interface ComponentPreviewProps {
  component: Component;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component.slug) {
    case "button":
      return (
        <div aria-label="Button preview" className="component-catalog-preview component-catalog-preview__buttons">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button loading>Saving</Button>
          <Button disabled>Unavailable</Button>
        </div>
      );
    case "badge":
      return (
        <div aria-label="Badge preview" className="component-catalog-preview component-catalog-preview__badges">
          <Badge>Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Stable</Badge>
          <Badge variant="warning">Review</Badge>
          <Badge variant="danger">Attention</Badge>
          <Badge variant="info">Information</Badge>
        </div>
      );
    case "card":
      return (
        <div aria-label="Card preview" className="component-catalog-preview component-catalog-preview__cards">
          <Card material="surface">
            <CardHeader>
              <CardTitle>Surface</CardTitle>
              <CardDescription>Default content grouping.</CardDescription>
            </CardHeader>
            <CardContent>Clear and quiet.</CardContent>
          </Card>
          <Card material="mist">
            <CardHeader>
              <CardTitle>Mist</CardTitle>
              <CardDescription>Secondary context.</CardDescription>
            </CardHeader>
            <CardContent>Supporting information.</CardContent>
          </Card>
          <Card className="component-catalog-preview__glass-card" material="glass">
            <CardHeader>
              <CardTitle>Glass</CardTitle>
              <CardDescription>Used sparingly.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    case "container":
      return (
        <div aria-label="Container preview" className="component-catalog-preview component-catalog-preview__containers">
          <Container className="component-catalog-preview__container component-catalog-preview__container--content" size="content">
            <span>Content width</span>
          </Container>
          <Container className="component-catalog-preview__container component-catalog-preview__container--wide" size="wide">
            <span>Wide width</span>
          </Container>
        </div>
      );
    default:
      return null;
  }
}
