"use client";
import ImageTrail from "./ImageTrail";

export default function Home() {
  return (
    <main style={{ backgroundColor: "white", cursor: "crosshair", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Tu nombre arriba fijo */}
      <h1 style={{ 
        position: "absolute", 
        top: "5vh", 
        width: "100%", 
        textAlign: "center", 
        fontSize: "0.9rem", 
        letterSpacing: "3px", 
        textTransform: "uppercase", 
        fontFamily: "serif", 
        zIndex: 10,
        color: "#1a1a1a"
      }}>
        Giulia
      </h1>

      {/* El rastro de imágenes */}
      <ImageTrail>
        <img src="/BEAUTIFUL_FAILURES_AY3.jpg" alt="Trail" style={{ width: "60px", opacity: 0.7 }} />
      </ImageTrail>
    </main>
  );
}