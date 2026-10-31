import { ImageResponse } from "next/og";

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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #fbfaf7 0%, #f5efe2 55%, #fce6da 100%)",
          color: "#111111",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", color: "#111111" }}>click</span>
            <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", color: "#e0673a" }}>menu</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#5c6068", marginLeft: 4 }}>.tn</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#111111",
              color: "#ffffff",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            En ligne en 48h · Sans application
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#111111",
            }}
          >
            Le menu digital QR code pour cafés & restaurants en Tunisie
          </div>
          <div style={{ fontSize: 28, color: "#4a4d55", lineHeight: 1.4, fontWeight: 500 }}>
            Carte interactive sur smartphone · Prix en Dinars modifiables en temps réel · Supports bois gravé & acrylique
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", gap: 16 }}>
            {["Tunis", "Sousse", "Hammamet", "Sfax", "Djerba"].map((city) => (
              <div
                key={city}
                style={{
                  background: "#f2d36b",
                  color: "#111111",
                  padding: "8px 18px",
                  borderRadius: 999,
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                {city}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111111" }}>
            www.clickmenu.tn · WhatsApp +216 97 991 266
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

