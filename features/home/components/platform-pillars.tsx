import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle, Container } from "@/components/ui";
import { platformPillars } from "../content";

export function PlatformPillars() {
  return (
    <section aria-labelledby="platform-pillars-title" className="home-section">
      <Container size="default">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Future platform</p>
          <h2 className="home-section__title" id="platform-pillars-title">
            Platform pillars
          </h2>
          <p className="home-section__description">
            Four focused areas will grow from the same contracts, design language, and quality baseline.
          </p>
        </div>

        <div className="home-pillar-grid">
          {platformPillars.map((pillar) => (
            <Card className="home-pillar" key={pillar.title} material="mist">
              <CardHeader>
                <Badge>{pillar.status}</Badge>
                <CardTitle>{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{pillar.description}</p>
                {pillar.href ? (
                  <Link className="home-link home-link--secondary" href={pillar.href}>
                    Explore {pillar.title}
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
