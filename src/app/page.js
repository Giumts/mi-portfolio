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
"use client";
import ImageTrail from "./ImageTrail";

export default function Home() {
  const trailImages = [
    "/imagen1.jpg", 
    "/imagen2.jpg",
    "/imagen3.jpg",
    "/imagen4.jpg",
  ];

  // Estilo base para todos los textos para que sean iguales
  const textStyle = {
    position: "absolute",
    fontSize: "0.8rem", // Un pelín más pequeño para que se vea más fino
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 20, // Por encima de todo
    color: "#1a1a1a",
    cursor: "pointer" // Para que parezca un botón
  };

  return (
    <main style={{ cursor: "crosshair", overflow: "hidden", backgroundColor: "white" }}>
      
      {/* 1. NOMBRE ARRIBA (Centro) */}
      <h1 style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center" }}>
        Giulia
      </h1>

      {/* 2. PROJECTS ABAJO (Centro) */}
      <div style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center" }}>
        Projects
      </div>

      {/* 3. ABOUT DERECHA (Descentrado) */}
      <div style={{ 
        ...textStyle, 
        right: "5vw", 
        top: "50%", 
        transform: "translateY(-50%)", // Centrado verticalmente a la derecha
        writingMode: "vertical-rl" // Opcional: ponerlo en vertical queda muy cool, si no lo quieres, borra esta línea
      }}>
        About
      </div>

      {/* El rastro de imágenes de fondo */}
      <ImageTrail images={trailImages} />

    </main>
  );
}