"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { id: 1, title: "Beautiful Failures I", img: "/BEAUTIFUL_FAILURES_AY1.jpg", desc: "Exploración de lo inacabado.", gallery: trailImages },
    { id: 2, title: "Beautiful Failures II", img: "/BEAUTIFUL_FAILURES_AY3.jpg", desc: "La estética del error.", gallery: trailImages },
    { id: 3, title: "Editorial Study", img: "/BEAUTIFUL_FAILURES_AY15.jpg", desc: "Diseño y vacío.", gallery: trailImages },
    { id: 4, title: "Light & Shadow", img: "/BEAUTIFUL_FAILURES_AY37.jpg", desc: "Contraste puro.", gallery: trailImages },
    { id: 5, title: "Visual Concept", img: "/BEAUTIFUL_FAILURES_AY42.jpg", desc: "Abstracción diaria.", gallery: trailImages },
    { id: 6, title: "Archive 01", img: "/BEAUTIFUL_FAILURES_AY49.jpg", desc: "Procesos guardados.", gallery: trailImages },
    { id: 7, title: "Motion Texture", img: "/BEAUTIFUL_FAILURES_AY51.jpg", desc: "Texturas en movimiento.", gallery: trailImages },
    { id: 8, title: "Silence", img: "/BEAUTIFUL_FAILURES_AY59.jpg", desc: "Minimalismo digital.", gallery: trailImages },
    { id: 9, title: "Form Study", img: "/BEAUTIFUL_FAILURES_AY71.jpg", desc: "Análisis de la forma.", gallery: trailImages },
    { id: 10, title: "Final Chapter", img: "/BEAUTIFUL_FAILURES_AY75.jpg", desc: "Conclusión de serie.", gallery: trailImages },
  ];

  useEffect(() => {
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: Math.floor(Math.random() * 10 - 5) + "deg",
      }));
      setRandomPositions(positions);
    }
  }, [view]);

  const openProject = (proj) => {
    const r = () => Math.floor(Math.random() * 25);
    setClipPath(`inset(${r()}% ${r()}% ${r()}% ${r()}%)`);
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const textStyle = {
    position: "fixed",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 1000, 
    color: "#1a1a1a",
    cursor: "crosshair",
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", cursor: "crosshair" }}>
      
      <style jsx global>{`
        body, html, * { cursor: crosshair !important; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* MENU */}
      <h1 onClick={() => {setView("home"); setSelectedProject(null);}} style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center", textDecoration: view === "home" ? "line-through" : "none" }}>Giulia</h1>
      <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center", textDecoration: view === "projects" ? "line-through" : "none" }}>Projects</div>
      <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)", textDecoration: view === "about" ? "line-through" : "none" }}>About</div>

      <AnimatePresence mode="wait">
        {/* HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh", overflow: "hidden"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {/* NUBE PROJECTS */}
        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
            {projects.map((proj, index) => (
              <motion.div 
                key={proj.id}
                onClick={() => openProject(proj)}
                style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "110px", textAlign: "center" }}
              >
                <motion.img src={proj.img} whileHover={{ scale: 1.1 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ marginTop: "8px", fontSize: "0.5rem", color: "#4a4a4a", textTransform: "uppercase" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* DETALLE DEL PROYECTO (NUEVO) */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100%", backgroundColor: "white" }}>
            {/* Cabecera */}
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "30px", textTransform: "uppercase" }}>{selectedProject.title}</p>
              <img src={selectedProject.img} style={{ width: "60vw", height: "60vh", objectFit: "cover", clipPath: clipPath, transition: "clip-path 1.2s ease" }} />
            </div>
            
            {/* Texto */}
            <div style={{ maxWidth: "400px", margin: "0 auto 15vh auto", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem", lineHeight: "1.8", color: "#4a4a4a" }}>
              {selectedProject.desc}
            </div>

            {/* Galería Scroll */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10vh", paddingBottom: "20vh" }}>
              {selectedProject.gallery.map((img, i) => (
                <motion.img 
                  key={i} src={img} 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  onClick={(e) => e.currentTarget.style.width = e.currentTarget.style.width === "80vw" ? "45vw" : "80vw"}
                  style={{ width: "45vw", transition: "width 0.6s ease", cursor: "zoom-in" }} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ABOUT */}
        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
            <div style={{ ...textStyle, position: "absolute", left: "5vw", top: "50%" }}>giulia@example.com</div>
            <div style={{ maxWidth: "350px", textAlign: "center", fontFamily: "serif" }}>Directora creativa...</div>
            <div style={{ ...textStyle, position: "absolute", right: "5vw", top: "60%" }}>+34 000 000 000</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}