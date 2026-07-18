import { ImageResponse } from "next/og";
import { siteConfig } from "../lib/site-config";

export const alt = "WebCraft platform overview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f7f8",
          color: "#17212b",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontFamily: "system-ui", fontSize: 32, fontWeight: 600 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div style={{ display: "flex", fontFamily: "system-ui", fontSize: 76, fontWeight: 700 }}>
            Build with clear foundations.
          </div>
          <div style={{ color: "#53606d", display: "flex", fontFamily: "system-ui", fontSize: 30, lineHeight: 1.35 }}>
            Projects, components, development guides, and safe browser-based code experiments.
          </div>
        </div>
        <div style={{ borderTop: "2px solid #cbd3d9", display: "flex", fontFamily: "system-ui", fontSize: 26, gap: 32, paddingTop: 24 }}>
          <span>Projects</span>
          <span>Components</span>
          <span>Guides</span>
          <span>Playground</span>
        </div>
      </div>
    ),
    size,
  );
}
