"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageTrail({ images = [] }) {
  const [trail, setTrail] = useState([]);
  const imageIndexRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const distance = Math.sqrt(
      Math.pow(clientX - lastPositionRef.current.x, 2) +
      Math.pow(clientY - lastPositionRef.current.y, 2)
    );

    if (distance > 60) {
      const newImage = {
        x: clientX,
        y: clientY,
        id: Date.now(),
        src: images[imageIndexRef.current],
        rotate: Math.random() * 20 - 10,
      };

      setTrail((prev) => [...prev.slice(-15), newImage]);
      lastPositionRef.current = { x: clientX, y: clientY };
      imageIndexRef.current = (imageIndexRef.current + 1) % images.length;
    }
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <AnimatePresence>
        {trail.map((img) => (
          <motion.img
            key={img.id}
            src={img.src}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }}
            transition={{ duration: 1.5 }}
            style={{
              position: "absolute", left: img.x, top: img.y,
              width: "150px", pointerEvents: "none",
              transform: "translate(-50%, -50%)",
              rotate: img.rotate, zIndex: 1
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}