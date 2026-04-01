import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Quijote Labs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), "public/assets/logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#030712",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow orb top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.18)",
            filter: "blur(100px)",
          }}
        />
        {/* Glow orb bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.12)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoBase64}
          width={110}
          height={110}
          style={{ marginBottom: 28, objectFit: "contain" }}
          alt="logo"
        />

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            Quijote
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 400,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "-1px",
            }}
          >
            Labs
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.5px",
          }}
        >
          Si tu negocio depende de ti, no es negocio.
        </div>
      </div>
    ),
    { ...size }
  );
}
