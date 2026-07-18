import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";
import { foundationItems } from "../content";

export function FoundationSection() {
  return (
    <section aria-labelledby="foundation-title" className="home-section" id="foundation">
      <Container size="default">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Built now</p>
          <h2 className="home-section__title" id="foundation-title">
            A practical foundation for the next layer.
          </h2>
        </div>

        <div className="home-foundation-grid">
          {foundationItems.map((item) => (
            <Card className="home-foundation-card" key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="home-foundation-card__marker">Verified foundation</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
