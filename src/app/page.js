"use client";
import ImageTrail from "./ImageTrail";

export default function Home() {
  const trailImages = [
    "/BEAUTIFUL_FAILURES_AY1.jpg", 
    "/BEAUTIFUL_FAILURES_AY3.jpg",
    "/BEAUTIFUL_FAILURES_AY15.jpg",
    "/BEAUTIFUL_FAILURES_AY37.jpg",
    "/BEAUTIFUL_FAILURES_AY42.jpg",
    "/BEAUTIFUL_FAILURES_AY49.jpg",
    "/BEAUTIFUL_FAILURES_AY51.jpg",
    "/BEAUTIFUL_FAILURES_AY59.jpg",
    "/BEAUTIFUL_FAILURES_AY71.jpg",
    "/BEAUTIFUL_FAILURES_AY75.jpg",
    "/BEAUTIFUL_FAILURES_AY9.jpg",
  ];

  const textStyle = {
    position: "absolute",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 20, 
    color: "#1a1a1a",
    cursor: "pointer"
  };

  return (
    <main style={{ 
      cursor: "crosshair", 
      overflow: "hidden", 
      backgroundColor: "white", 
      height: "100vh", 
      width: "100vw",
      position: "relative" 
    }}>
      
      {/* 1. NOMBRE ARRIBA */}
      <h1 style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center" }}>
        Giulia
      </h1>

      {/* 2. PROJECTS ABAJO */}
      <div style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center" }}>
        Projects
      </div>

      {/* 3. ABOUT DERECHA (Horizontal y decentrado hacia arriba) */}
      <div style={{ 
        ...textStyle, 
        right: "8vw",     // Un poco más separado del borde
        top: "40%",       // Decentrado (un poco más arriba del centro)
        transform: "translateY(-50%)"
      }}>
        About
      </div>

      {/* El rastro de imágenes */}
      <ImageTrail images={trailImages} />

    </main>
  );
}