import Link from "next/link";
import { Container } from "@/components/ui";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="home-final">
      <Container size="default">
        <div className="home-final__panel wc-glass">
          <div>
            <p className="home-section__eyebrow">Ready for the next layer</p>
            <h2 className="home-final__title" id="final-cta-title">
              The foundation is live.
            </h2>
            <p className="home-final__description">
              The system, rules, design language, and quality pipeline are ready for the next layer of WebCraft.
            </p>
          </div>
          <Link className="home-link home-link--primary" href="/design-system">
            Review the design system
          </Link>
        </div>
      </Container>
    </section>
  );
}
