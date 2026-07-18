import Link from "next/link";
import { Container } from "@/components/ui";

const recoveryLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/components", label: "Components" },
  { href: "/guides", label: "Guides" },
  { href: "/playground", label: "Playground" },
] as const;

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="system-page">
      <Container size="content">
        <div className="system-page__panel wc-surface">
          <p className="system-page__eyebrow">404</p>
          <h1 id="not-found-title">This page could not be found</h1>
          <p>
            The address may be outdated, or the page may not exist in the current WebCraft
            foundation.
          </p>
          <div className="system-page__actions">
            <Link className="wc-button wc-button--primary" href="/">
              Return home
            </Link>
          </div>
          <nav aria-label="Recovery navigation">
            <ul className="system-page__links">
              {recoveryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
