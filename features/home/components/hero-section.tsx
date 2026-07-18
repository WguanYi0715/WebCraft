import Link from "next/link";
import { Container } from "@/components/ui";
import { homeHero } from "../content";

export function HeroSection() {
  return (
    <section aria-labelledby="home-hero-title" className="home-hero">
      <Container className="home-hero__grid" size="wide">
        <div className="home-hero__copy">
          <p className="home-hero__status wc-mist">{homeHero.status}</p>
          <h1 className="home-hero__title" id="home-hero-title">
            {homeHero.title}
          </h1>
          <p className="home-hero__description">{homeHero.description}</p>
          <div className="home-hero__actions">
            <Link className="home-link home-link--primary" href="/design-system">
              Explore the design system
            </Link>
            <a className="home-link home-link--secondary" href="#foundation">
              See the foundation
            </a>
          </div>
        </div>

        <div aria-hidden="true" className="home-core wc-crystal">
          <span className="home-core__grid" />
          <span className="home-core__orbit home-core__orbit--outer" />
          <span className="home-core__orbit home-core__orbit--inner" />
          <span className="home-core__rail home-core__rail--horizontal" />
          <span className="home-core__rail home-core__rail--vertical" />
          <span className="home-core__node home-core__node--primary" />
          <span className="home-core__node home-core__node--secondary" />
          <span className="home-core__node home-core__node--tertiary" />
        </div>
      </Container>
    </section>
  );
}
