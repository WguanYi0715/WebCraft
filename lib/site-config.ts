import type { Metadata } from "next";
import { primaryNavigation } from "./navigation";

const fallbackSiteUrl = "http://localhost:3000";

export const siteConfig = {
  name: "WebCraft",
  shortName: "WebCraft",
  description:
    "A structured platform for exploring projects, components, development guides, and safe browser-based code experiments.",
  defaultTitle: "WebCraft",
  titleTemplate: "%s | WebCraft",
  locale: "en_US",
  navigation: primaryNavigation,
} as const;

export function getSiteUrl(value = process.env.SITE_URL): string {
  if (!value) {
    return fallbackSiteUrl;
  }

  try {
    const url = new URL(value);

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password
    ) {
      return fallbackSiteUrl;
    }

    return url.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export function createAbsoluteUrl(path = "/"): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const pageTitle = title === siteConfig.defaultTitle ? { absolute: title } : title;
  const openGraphTitle =
    title === siteConfig.defaultTitle ? title : `${title} | ${siteConfig.name}`;
  const image = createAbsoluteUrl("/opengraph-image");

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: createAbsoluteUrl(path),
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: createAbsoluteUrl(path),
      siteName: siteConfig.name,
      title: openGraphTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [image],
    },
  };
}
