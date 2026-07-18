import type { Metadata } from "next";
import { createPageMetadata, siteConfig } from "@/lib/site-config";
import {
  FinalCta,
  FoundationSection,
  GrowthFlow,
  HeroSection,
  PlatformPillars,
} from "@/features/home";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <PlatformPillars />
      <FoundationSection />
      <GrowthFlow />
      <FinalCta />
    </div>
  );
}
