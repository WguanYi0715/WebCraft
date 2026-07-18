import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";
import { Container } from "@/components/ui";

function NavigationLinks() {
  return (
    <ul className="wc-site-header__nav-list">
      {primaryNavigation.map((item) => (
        <li key={item.href}>
          <Link className="wc-site-header__nav-link" href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  return (
    <header className="wc-site-header wc-glass">
      <Container className="wc-site-header__inner" size="default">
        <Link className="wc-site-header__brand" href="/">
          WebCraft
        </Link>

        <nav aria-label="Primary navigation" className="wc-site-header__nav">
          <NavigationLinks />
        </nav>

        <details className="wc-site-header__mobile-menu">
          <summary className="wc-site-header__mobile-summary">Menu</summary>
          <nav
            aria-label="Mobile navigation"
            className="wc-site-header__mobile-navigation"
          >
            <NavigationLinks />
          </nav>
        </details>
      </Container>
    </header>
  );
}
