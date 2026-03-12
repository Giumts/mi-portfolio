"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");
  // Nuevo estado para la posición aleatoria de la imagen de cabecera
  const [headerPos, setHeaderPos] = useState({ top: "0", left: "0" });

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { id: 1, title: "Beautiful Failures I", img: "/BEAUTIFUL_FAILURES_AY1.jpg", desc: "Una búsqueda de la armonía en el error digital y la composición orgánica.", gallery: trailImages },
    { id: 2, title: "Beautiful Failures II", img: "/BEAUTIFUL_FAILURES_AY3.jpg", desc: "La imperfección como lenguaje visual predominante.", gallery: trailImages },
    // ... (resto de proyectos iguales)
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
    
    // Generar posición aleatoria para la imagen pequeña de cabecera
    setHeaderPos({
      marginTop: Math.floor(Math.random() * 10 - 5) + "vh",
      marginLeft: Math.floor(Math.random() * 20 - 10) + "vw"
    });

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

      <nav>
        <h1 onClick={() => {setView("home"); setSelectedProject(null);}} style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center", textDecoration: view === "home" ? "line-through" : "none" }}>Giulia</h1>
        <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center", textDecoration: view === "projects" ? "line-through" : "none" }}>Projects</div>
        <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)", textDecoration: view === "about" ? "line-through" : "none" }}>About</div>
      </nav>

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh", overflow: "hidden"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => openProject(proj)} style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "110px", textAlign: "center" }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.1 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ marginTop: "8px", fontSize: "0.55rem", color: "#4a4a4a", textTransform: "uppercase" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", backgroundColor: "white" }}>
            {/* Cabecera con imagen PEQUEÑA y posición ALEATORIA */}
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>{selectedProject.title}</p>
              <img 
                src={selectedProject.img} 
                style={{ 
                  width: "25vw", // Imagen pequeña
                  height: "auto", 
                  objectFit: "cover", 
                  clipPath: clipPath, 
                  transition: "all 1s ease",
                  marginTop: headerPos.marginTop,
                  marginLeft: headerPos.marginLeft
                }} 
              />
            </div>
            
            <div style={{ maxWidth: "400px", margin: "0 auto 20vh auto", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem", lineHeight: "1.8", color: "#1a1a1a" }}>
              {selectedProject.desc}
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20vh", paddingBottom: "30vh" }}>
              {selectedProject.gallery.map((img, i) => (
                <div key={i} style={{ 
                  width: "100%", 
                  display: "flex", 
                  justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                  padding: i % 2 === 0 ? "0 0 0 10vw" : "0 10vw 0 0",
                  boxSizing: "border-box"
                }}>
                  <motion.img 
                    src={img} 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ width: i % 3 === 0 ? "50vw" : "35vw", cursor: "zoom-in" }} 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ... (vista About se mantiene igual) */}
      </AnimatePresence>
    </main>
  );
}