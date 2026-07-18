"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <section aria-labelledby="error-page-title" className="system-page" role="alert">
      <Container size="content">
        <div className="system-page__panel wc-surface">
          <p className="system-page__eyebrow">Something went wrong</p>
          <h1 id="error-page-title">We could not load this page</h1>
          <p>
            Please try again. If the problem continues, return home and choose another
            available section.
          </p>
          <div className="system-page__actions">
            <button className="wc-button wc-button--primary" onClick={reset} type="button">
              Try again
            </button>
            <Link className="wc-button wc-button--secondary" href="/">
              Return home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
