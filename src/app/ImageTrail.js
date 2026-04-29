"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageTrail({ children, images = [] }) {
  const [trail, setTrail] = useState([]);
  const imageIndexRef = useRef(0); // Referencia para el índice de la imagen actual
  const lastPositionRef = useRef({ x: 0, y: 0 }); // Referencia para la última posición del ratón

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Calcular la distancia movida desde la última imagen
    const distance = Math.sqrt(
      Math.pow(clientX - lastPositionRef.current.x, 2) +
      Math.pow(clientY - lastPositionRef.current.y, 2)
    );

    // Solo añadir una nueva imagen si el ratón se ha movido una distancia mínima
    // Aumenta este número para que las imágenes estén más separadas (más lento)
    if (distance > 50) {
      const newImage = {
        x: clientX,
        y: clientY,
        id: Date.now(),
        // Usar el índice actual y luego incrementarlo, volviendo a 0 al final
        src: images[imageIndexRef.current],
      };

      setTrail((prev) => [...prev.slice(-15), newImage]); // Guardar las últimas 15 imágenes

      // Actualizar la referencia de posición y el índice de imagen
      lastPositionRef.current = { x: clientX, y: clientY };
      imageIndexRef.current = (imageIndexRef.current + 1) % images.length;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "white", // Asegurar fondo blanco para el contraste
      }}
    >
      {children} {/* Renderizar el contenido fijo (nombre) */}
      <AnimatePresence>
        {trail.map((img) => (
          <motion.img
            key={img.id}
            src={img.src}
            alt="Trail"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} // Empezar invisible, pequeño y muy borroso
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}    // Aparecer nítido y a tamaño real
            exit={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }}    // Desaparecer grande, invisible y muy borroso
            transition={{
              // Configurar la duración de cada fase (más alto = más lento)
              opacity: { duration: 1.5, ease: "easeOut" }, 
              scale: { duration: 1.5, ease: "easeOut" },
              filter: { duration: 2, ease: "easeOut" }, // El blur tarda más en quitarse/ponerse
              
              // Ajuste fino para la desaparición (exit)
              exit: {
                  opacity: { duration: 2.5, ease: "easeInOut" },
                  filter: { duration: 3, ease: "easeInOut" }
              }
            }}
            style={{
              position: "absolute",
              left: img.x,
              top: img.y,
              width: "150px", // Tamaño de las imágenes del rastro
              height: "auto",
              pointerEvents: "none",
              transform: "translate(-50%, -50%)", // Centrar la imagen en el cursor
              zIndex: 1, // Asegurar que estén por debajo del nombre
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
