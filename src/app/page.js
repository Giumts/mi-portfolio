"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");
  const [headerPos, setHeaderPos] = useState({ x: 0, y: 0 });
  
  // ESTADOS PARA EL TEXTO QUE SIGUE AL MOUSE
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { id: 1, title: "Beautiful Failures I", img: "/BEAUTIFUL_FAILURES_AY1.jpg", desc: "Una búsqueda de la armonía en el error digital y la composición orgánica.", gallery: trailImages },
    { id: 2, title: "Beautiful Failures II", img: "/BEAUTIFUL_FAILURES_AY3.jpg", desc: "La imperfección como lenguaje visual predominante.", gallery: trailImages },
    { id: 3, title: "Editorial Study", img: "/BEAUTIFUL_FAILURES_AY15.jpg", desc: "Exploración rítmica del espacio en blanco.", gallery: trailImages },
    { id: 4, title: "Light & Shadow", img: "/BEAUTIFUL_FAILURES_AY37.jpg", desc: "El contraste extremo define la forma.", gallery: trailImages },
    { id: 5, title: "Visual Concept", img: "/BEAUTIFUL_FAILURES_AY42.jpg", desc: "Abstracción aplicada al diseño contemporáneo.", gallery: trailImages },
    { id: 6, title: "Archive 01", img: "/BEAUTIFUL_FAILURES_AY49.jpg", desc: "Fragmentos de un proceso inacabado.", gallery: trailImages },
    { id: 7, title: "Motion Texture", img: "/BEAUTIFUL_FAILURES_AY51.jpg", desc: "Capturando la esencia del movimiento estático.", gallery: trailImages },
    { id: 8, title: "Silence", img: "/BEAUTIFUL_FAILURES_AY59.jpg", desc: "Reducción visual al mínimo exponente.", gallery: trailImages },
    { id: 9, title: "Form Study", img: "/BEAUTIFUL_FAILURES_AY71.jpg", desc: "Anatomía de la forma pura.", gallery: trailImages },
    { id: 10, title: "Final Chapter", img: "/BEAUTIFUL_FAILURES_AY75.jpg", desc: "Conclusión de la serie exploratoria.", gallery: trailImages },
  ];

  // RASTREO DEL MOUSE
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    setHeaderPos({
      x: Math.floor(Math.random() * 40 - 20) + "vw",
      y: Math.floor(Math.random() * 20 - 10) + "vh"
    });
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo({ top: 0, behavior: 'instant' });
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

      {/* TEXTO QUE SIGUE AL MOUSE (FLOAT TEXT) */}
      <AnimatePresence>
        {isHovering && view === "detail" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: mousePos.y + 15,
              left: mousePos.x + 15,
              zIndex: 9999,
              pointerEvents: "none", // Para que no bloquee el click
              fontSize: "0.5rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "4px 8px",
              fontFamily: "serif"
            }}
          >
            {selectedProject?.title} — View
          </motion.div>
        )}
      </AnimatePresence>

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
            
            {/* PORTADA DETALLE */}
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <motion.p style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "40px", textTransform: "uppercase", color: "#888" }}>{selectedProject.title}</motion.p>
              <motion.img 
                src={selectedProject.img} 
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ width: "18vw", height: "auto", clipPath: clipPath, x: headerPos.x, y: headerPos.y, transition: "clip-path 1.5s ease" }} 
              />
              <motion.div style={{ maxWidth: "300px", marginTop: "60px", textAlign: "center", fontFamily: "serif", fontSize: "0.85rem", fontStyle: "italic", lineHeight: "1.6", color: "#444" }}>{selectedProject.desc}</motion.div>
            </div>

            {/* GALERÍA CON TEXTO FLOTANTE */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "25vh", paddingBottom: "40vh" }}>
              {selectedProject.gallery.map((img, i) => (
                <div key={i} style={{ 
                  width: "100%", 
                  display: "flex", 
                  justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                  padding: i % 2 === 0 ? "0 0 0 12vw" : "0 12vw 0 0",
                  boxSizing: "border-box"
                }}>
                  <motion.img 
                    src={img} 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    style={{ 
                      width: i % 3 === 0 ? "45vw" : (i % 2 === 0 ? "30vw" : "38vw"), 
                    }} 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ... About ... */}
      </AnimatePresence>
    </main>
  );
}