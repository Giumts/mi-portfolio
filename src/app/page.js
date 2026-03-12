"use client";
import { useState } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home"); // "home" o "projects"

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

  // Datos de tus proyectos (puedes añadir más aquí)
  const projects = [
    { id: 1, title: "Beautiful Failures", img: "/BEAUTIFUL_FAILURES_AY1.jpg" },
    { id: 2, title: "Project Two", img: "/BEAUTIFUL_FAILURES_AY15.jpg" },
    { id: 3, title: "Project Three", img: "/BEAUTIFUL_FAILURES_AY37.jpg" },
    { id: 4, title: "Project Four", img: "/BEAUTIFUL_FAILURES_AY59.jpg" },
  ];

  const textStyle = {
    position: "absolute",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 50, 
    color: "#1a1a1a",
    cursor: "pointer",
    transition: "opacity 0.3s ease"
  };

  return (
    <main style={{ backgroundColor: "white", height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      
      {/* NAVEGACIÓN FIJA */}
      <h1 
        onClick={() => setView("home")} 
        style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center" }}
      >
        Giulia
      </h1>

      <div 
        onClick={() => setView("projects")} 
        style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center", fontWeight: view === "projects" ? "bold" : "normal" }}
      >
        Projects
      </div>

      <div style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)" }}>
        About
      </div>

      {/* CONTENIDO DINÁMICO */}
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <ImageTrail images={trailImages} />
          </motion.div>
        ) : (
          <motion.div 
            key="projects"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "40px", 
              padding: "15vh 10vw",
              height: "100vh",
              overflowY: "auto"
            }}
          >
            {projects.map((proj) => (
              <motion.div 
                key={proj.id}
                whileHover={{ scale: 1.05 }}
                style={{ textAlign: "center", cursor: "pointer", position: "relative" }}
              >
                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  style={{ width: "100%", height: "250px", objectFit: "cover", filter: "grayscale(100%)", transition: "filter 0.5s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.filter = "grayscale(0%)"}
                  onMouseOut={(e) => e.currentTarget.style.filter = "grayscale(100%)"}
                />
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ 
                    marginTop: "10px", 
                    fontSize: "0.7rem", 
                    letterSpacing: "1px", 
                    fontFamily: "serif",
                    textTransform: "uppercase" 
                  }}
                >
                  {proj.title}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}