import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const dynamic = "force-static";
export const alt = `${person.name} | ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 50% -10%, rgba(198,244,50,0.22), #0b0b0a 55%)",
          color: "#edece6",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#a3a198", fontFamily: "monospace" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#c6f432" }} />
          {person.role} · {person.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>I turn raw data into</span>
          <span style={{ color: "#c6f432", fontStyle: "italic" }}>decisions.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a3a198", fontFamily: "monospace" }}>
          <span style={{ color: "#edece6" }}>{person.name}</span>
          <span>analytics eng · ML · applied AI</span>
        </div>
      </div>
    ),
    size,
  );
}
