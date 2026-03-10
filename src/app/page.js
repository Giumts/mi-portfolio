"use client";
import ImageTrail from "./ImageTrail";

export default function Home() {
  // Define AQUÍ tu array de imágenes de la carpeta public
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
    // Añade tantas como quieras
  ];

  return (
    <main style={{ cursor: "crosshair", overflow: "hidden" }}>
      {/* Pasar el array de imágenes al componente ImageTrail */}
      <ImageTrail images={trailImages}>
        {/* Tu nombre arriba fijo, con zIndex alto para estar siempre encima */}
        <h1 style={{ 
          position: "absolute", 
          top: "5vh", 
          width: "100%", 
          textAlign: "center", 
          fontSize: "0.9rem", 
          letterSpacing: "3px", 
          textTransform: "uppercase", 
          fontFamily: "serif", 
          zIndex: 10, // Muy alto para estar sobre el rastro
          color: "#1a1a1a"
        }}>
          Giulia
        </h1>
      </ImageTrail>
    </main>
  );
}