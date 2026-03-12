"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);

  const trailImages = [
    "/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg",
    "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg",
    "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg",
    "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg",
    "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg",
    "/BEAUTIFUL_FAILURES_AY9.jpg",
  ];

  const projects = [
    { id: 1, title: "Beautiful Failures I", img: "/BEAUTIFUL_FAILURES_AY1.jpg" },
    { id: 2, title: "Beautiful Failures II", img: "/BEAUTIFUL_FAILURES_AY3.jpg" },
    { id: 3, title: "Editorial Study", img: "/BEAUTIFUL_FAILURES_AY15.jpg" },
    { id: 4, title: "Light & Shadow", img: "/BEAUTIFUL_FAILURES_AY37.jpg" },
    { id: 5, title: "Visual Concept", img: "/BEAUTIFUL_FAILURES_AY42.jpg" },
    { id: 6, title: "Archive 01", img: "/BEAUTIFUL_FAILURES_AY49.jpg" },
    { id: 7, title: "Motion Texture", img: "/BEAUTIFUL_FAILURES_AY51.jpg" },
    { id: 8, title: "Silence", img: "/BEAUTIFUL_FAILURES_AY59.jpg" },
    { id: 9, title: "Form Study", img: "/BEAUTIFUL_FAILURES_AY71.jpg" },
    { id: 10, title: "Final Chapter", img: "/BEAUTIFUL_FAILURES_AY75.jpg" },
  ];

  useEffect(() => {
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 65 + 15) + "vh",
        left: Math.floor(Math.random() * 75 + 10) + "vw",
        rotation: Math.floor(Math.random() * 10 - 5) + "deg",
      }));
      setRandomPositions(positions);
    }
  }, [view]);

  const textStyle = {
    position: "absolute",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 100, 
    color: "#1a1a1a",
    cursor: "crosshair",
  };

  return (
    <main style={{ 
      backgroundColor: "white", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      position: "relative",
      cursor: "crosshair" 
    }}>
      
      {/* Inyectamos el cursor de cruz globalmente */}
      <style jsx global>{`
        body, html, * { cursor: crosshair !important; }
      `}</style>

      {/* NAVEGACIÓN */}
      <h1 onClick={() => setView("home")} style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center" }}>
        Giulia
      </h1>
      
      <div onClick={() => setView("projects")} style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center" }}>
        <span style={{ borderBottom: view === "projects" ? "1px solid #1a1a1a" : "none", paddingBottom: "2px" }}>
          Projects
        </span>
      </div>

      <div style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)" }}>
        About
      </div>

      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ImageTrail images={trailImages} />
          </motion.div>
        ) : (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100%", height: "100%" }}>
            {projects.map((proj, index) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{ 
                  position: "absolute", 
                  top: randomPositions[index]?.top || "50%", 
                  left: randomPositions[index]?.left || "50%",
                  rotate: randomPositions[index]?.rotation || "0deg",
                  width: "100px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <motion.img 
                    src={proj.img} 
                    alt={proj.title} 
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    style={{ width: "100%", height: "auto", filter: "grayscale(100%)", transition: "filter 0.4s" }}
                    onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
                    onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
                  />
                  <p className="title-text" style={{ 
                    marginTop: "8px", 
                    fontSize: "0.5rem", 
                    letterSpacing: "1px", 
                    fontFamily: "serif",
                    textTransform: "uppercase",
                    textAlign: "center"
                  }}>
                    {proj.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}