import { ImageResponse } from "next/og";

export const alt = "BROKERSHUB, compliance for mortgage and finance brokers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2fd6a4",
          color: "#14262e",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>BROKERSHUB</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
            Every loan file defensible before anyone asks.
          </div>
          <div style={{ marginTop: 28, fontSize: 34, opacity: 0.85 }}>Compliance for mortgage and finance brokers</div>
        </div>
      </div>
    ),
    size,
  );
}
