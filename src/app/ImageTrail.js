"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ImageTrail({ children }) {
  const [images, setImages] = useState([]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const newImage = { x: clientX, y: clientY, id: Date.now() };
    setImages((prev) => [...prev.slice(-10), newImage]); // Guarda las últimas 10 posiciones
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {images.map((img) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ position: "absolute", left: img.x, top: img.y, pointerEvents: "none", transform: "translate(-50%, -50%)" }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}