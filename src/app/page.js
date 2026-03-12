"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { 
      id: "p1", 
      title: "Beautiful Failures I", 
      img: "/BEAUTIFUL_FAILURES_AY1.jpg", 
      description: "Exploración visual sobre la estética del error.", 
      gallery: ["/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"] 
    },
    // Añade aquí el resto de tus 10 proyectos con el mismo formato...
  ];

  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: Math.floor(Math.random() * 10 - 5) + "deg",
      }));
      setRandomPositions(positions);
    }
    if (view.startsWith("p")) {
      const r = () => Math.floor(Math.random() * 25);
      setClipPath(`inset(${r()}% ${r()}% ${r()}% ${r()}%)`);
      window.scrollTo(0, 0);
    }
  }, [view, projects.length]);

  const textStyle = {
    position: "fixed",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "serif",
    zIndex: 200, 
    color: "#1a1a1a",
    cursor: "crosshair",
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", cursor: "crosshair", overflowX: "hidden" }}>
      
      <style jsx global>{`
        body, html, * { cursor: crosshair !important; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* MENU FIJO */}
      <nav>
        <h1 onClick={() => { setView("home"); setSelectedProject(null); }} style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center", textDecoration: view === "home" ? "line-through" : "none" }}>Giulia</h1>
        <div onClick={() => { setView("projects"); setSelectedProject(null); }} style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center", textDecoration: view === "projects" ? "line-through" : "none" }}>Projects</div>
        <div onClick={() => { setView("about"); setSelectedProject(null); }} style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)", textDecoration: view === "about" ? "line-through" : "none" }}>About</div>
      </nav>

      <AnimatePresence mode="wait">
        {/* 1. HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {/* 2. NUBE DE PROYECTOS (ESTÉTICA RECUPERADA) */}
        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            {projects.map((proj, index) => (
              <motion.div 
                key={proj.id} 
                onClick={() => { setView(proj.id); setSelectedProject(proj); }} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{ 
                  position: "absolute", 
                  top: randomPositions[index]?.top, 
                  left: randomPositions[index]?.left, 
                  rotate: randomPositions[index]?.rotation, 
                  width: "110px", // Tamaño pequeño
                  zIndex: 50,
                  textAlign: "center"
                }}
              >
                <div style={{ position: "relative" }}>
                  <motion.img 
                    src={proj.img} 
                    whileHover={{ scale: 1.1 }} 
                    style={{ width: "100%", height: "auto", filter: "grayscale(100%)", transition: "filter 0.4s" }} 
                    onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} 
                    onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} 
                  />
                  {/* Título recuperado en gris intenso */}
                  <p style={{ 
                    marginTop: "8px", 
                    fontSize: "0.55rem", 
                    letterSpacing: "1px", 
                    fontFamily: "serif", 
                    textTransform: "uppercase", 
                    color: "#4a4a4a" 
                  }}>
                    {proj.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 3. DETALLE DE PROYECTO */}
        {selectedProject && view === selectedProject.id && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw" }}>
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "30px", textTransform: "uppercase" }}>{selectedProject.title}</p>
              <img src={selectedProject.img} style={{ width: "60vw", height: "60vh", objectFit: "cover", clipPath: clipPath, transition: "clip-path 1s ease" }} />
            </div>
            <div style={{ maxWidth: "400px", margin: "0 auto 15vh auto", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem", lineHeight: "1.8", color: "#4a4a4a" }}>
              {selectedProject.description}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15vh", paddingBottom: "20vh" }}>
              {selectedProject.gallery.map((url, i) => (
                <motion.img 
                  key={i} 
                  src={url} 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  onClick={(e) => { e.currentTarget.style.width = e.currentTarget.style.width === "85vw" ? "45vw" : "85vw"; }}
                  style={{ width: "45vw", transition: "width 0.6s ease", cursor: "zoom-in" }} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. ABOUT */}
        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
            <div style={{ ...textStyle, left: "5vw", top: "50%", transform: "translateY(-50%)", fontSize: "0.6rem" }}>giulia@example.com</div>
            <div style={{ maxWidth: "350px", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem", color: "#1a1a1a" }}>Directora creativa enfocada en la estética del error.</div>
            <div style={{ ...textStyle, right: "5vw", top: "60%", fontSize: "0.6rem" }}>+34 000 000 000</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}