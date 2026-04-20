import React from "react";

export function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, background: "#f4f3ff" }}
    >
      {/* Electric blue-violet */}
      <div
        className="absolute animate-blob"
        style={{
          top: "-15%",
          left: "-10%",
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(120,160,255,0.75) 0%, rgba(160,130,255,0.5) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Vivid violet */}
      <div
        className="absolute animate-blob animation-delay-2000"
        style={{
          top: "15%",
          right: "-5%",
          width: "680px",
          height: "680px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 55% 45%, rgba(190,130,255,0.7) 0%, rgba(210,160,255,0.45) 45%, transparent 70%)",
          filter: "blur(65px)",
        }}
      />
      {/* Warm pink */}
      <div
        className="absolute animate-blob animation-delay-4000"
        style={{
          bottom: "-10%",
          left: "5%",
          width: "820px",
          height: "820px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 55%, rgba(255,160,210,0.65) 0%, rgba(255,180,200,0.4) 45%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />
      {/* Cyan-mint */}
      <div
        className="absolute animate-blob animation-delay-6000"
        style={{
          bottom: "5%",
          right: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 45% 45%, rgba(100,220,210,0.6) 0%, rgba(130,210,255,0.4) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Peach center */}
      <div
        className="absolute animate-blob"
        style={{
          top: "35%",
          left: "35%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,200,150,0.55) 0%, rgba(255,220,180,0.3) 45%, transparent 70%)",
          filter: "blur(55px)",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}
