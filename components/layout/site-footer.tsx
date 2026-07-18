import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="wc-site-footer wc-surface">
      <Container className="wc-site-footer__inner" size="default">
        <div className="wc-site-footer__identity">
          <p className="wc-site-footer__name">WebCraft</p>
          <p className="wc-site-footer__description">
            Projects, components, guides, and safe browser experiments.
          </p>
          <p className="wc-site-footer__phase">Foundation-building phase</p>
        </div>

        <nav aria-label="Footer navigation" className="wc-site-footer__nav">
          <ul className="wc-site-footer__nav-list">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link className="wc-site-footer__nav-link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
