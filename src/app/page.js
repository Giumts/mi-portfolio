"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home"); // home, projects, about, o el ID del proyecto
  const [randomPositions, setRandomPositions] = useState([]);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { id: "p1", title: "Beautiful Failures I", img: "/BEAUTIFUL_FAILURES_AY1.jpg", description: "Una exploración profunda sobre la estética del error y la belleza encontrada en los procesos inacabados.", gallery: ["/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"] },
    // Puedes replicar esta estructura para p2, p3...
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
    if (typeof view === "string" && view.startsWith("p")) {
      // Generar un recorte aleatorio para la imagen principal
      const r = () => Math.floor(Math.random() * 30);
      setClipPath(`inset(${r()}% ${r()}% ${r()}% ${r()}%)`);
      window.scrollTo(0, 0);
    }
  }, [view]);

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
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", cursor: "crosshair" }}>
      
      <style jsx global>{`
        body, html, * { cursor: crosshair !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NAVEGACIÓN FIJA */}
      <h1 onClick={() => setView("home")} style={{ ...textStyle, top: "5vh", width: "100%", textAlign: "center", textDecoration: view === "home" ? "line-through" : "none" }}>Giulia</h1>
      <div onClick={() => setView("projects")} style={{ ...textStyle, bottom: "5vh", width: "100%", textAlign: "center", textDecoration: view === "projects" ? "line-through" : "none" }}>Projects</div>
      <div onClick={() => setView("about")} style={{ ...textStyle, right: "8vw", top: "40%", transform: "translateY(-50%)", textDecoration: view === "about" ? "line-through" : "none" }}>About</div>

      <AnimatePresence mode="wait">
        {/* VISTA HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh", overflow: "hidden"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {/* VISTA NUBE PROJECTS */}
        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => { setView(proj.id); setSelectedProject(proj); }} style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "100px" }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.1 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VISTA DETALLE PROYECTO */}
        {selectedProject && view === selectedProject.id && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingBottom: "20vh" }}>
            {/* Cabecera: Título y Foto Recortada */}
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>{selectedProject.title}</p>
              <img src={selectedProject.img} style={{ width: "60vw", height: "60vh", objectFit: "cover", clipPath: clipPath, transition: "clip-path 1s ease-in-out" }} />
            </div>

            {/* Texto Central */}
            <div style={{ maxWidth: "400px", margin: "0 auto 15vh auto", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem", lineHeight: "1.8" }}>
              {selectedProject.description}
            </div>

            {/* Galería Ordenada */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10vh" }}>
              {selectedProject.gallery.map((url, i) => (
                <motion.img 
                  key={i} 
                  src={url} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.currentTarget.style.width = e.currentTarget.style.width === "80vw" ? "40vw" : "80vw";
                  }}
                  style={{ width: "40vw", transition: "width 0.5s ease", cursor: "zoom-in" }} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* VISTA ABOUT (Se mantiene igual que antes) */}
        {view === "about" && (
           <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
             <div style={{ ...textStyle, left: "5vw", top: "50%", transform: "translateY(-50%)", fontSize: "0.6rem" }}>giulia@example.com</div>
             <div style={{ maxWidth: "350px", textAlign: "center", fontFamily: "serif", fontSize: "0.9rem" }}>Directora creativa y artista visual...</div>
             <div style={{ ...textStyle, right: "5vw", top: "60%", fontSize: "0.6rem" }}>+34 000 000 000</div>
           </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}