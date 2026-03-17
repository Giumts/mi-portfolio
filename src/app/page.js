"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoverData, setHoverData] = useState({ active: false, title: "", text: "" });

  const springConfig = { stiffness: 250, damping: 25 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Lineal Thin', sans-serif";
  const fontBody = "'Roundo Extra Light', sans-serif";

  // Simulación de galería con textos específicos para el cursor
  const projectGallery = [
    { src: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "el primer error" },
    { src: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "fragmentos orgánicos" },
    { src: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "composición rítmica" },
    { src: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "abstracción pura" },
    { src: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "la forma del vacío" },
  ];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24seconds.jpg", desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", info: { date: "2024", location: "barcelona", role: "creative direction" }, gallery: projectGallery },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, gallery: projectGallery },
    // ... resto de proyectos
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative" }}>
      
      <style jsx global>{`
        @font-face { font-family: 'Lineal Thin'; src: url('/fonts/Lineal-Thin.otf') format('opentype'); }
        @font-face { font-family: 'Roundo Extra Light'; src: url('/fonts/Roundo-ExtraLight.otf') format('opentype'); }
        body, html, * { cursor: crosshair !important; margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* CURSOR DINÁMICO MEJORADO */}
      <AnimatePresence>
        {hoverData.active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "fixed", x: mouseX, y: mouseY,
              marginLeft: "20px", marginTop: "20px",
              zIndex: 9999, pointerEvents: "none",
              display: "flex", flexDirection: "column", gap: "4px"
            }}
          >
            <span style={{ fontFamily: fontTitle, fontSize: "2.5rem", color: kleinBlue, textTransform: "lowercase", lineHeight: "0.9" }}>
              {hoverData.title}
            </span>
            <span style={{ fontFamily: fontBody, fontSize: "0.9rem", color: "#000", textTransform: "lowercase", marginLeft: "2px" }}>
              {hoverData.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVEGACIÓN */}
      <nav>
        {view === "home" ? (
          <>
            <motion.h1 onClick={() => setView("home")} style={{ position: "fixed", top: "5vh", width: "100%", textAlign: "center", textDecoration: "line-through", zIndex: 1000, fontFamily: fontTitle, color: kleinBlue, fontSize: "1.1rem" }}>giulia</motion.h1>
            <div onClick={() => setView("projects")} style={{ position: "fixed", bottom: "5vh", width: "100%", textAlign: "center", zIndex: 1000, fontFamily: fontTitle, color: kleinBlue, fontSize: "1.1rem" }}>projects</div>
            <div onClick={() => setView("about")} style={{ position: "fixed", right: "8vw", top: "40%", zIndex: 1000, fontFamily: fontTitle, color: kleinBlue, fontSize: "1.1rem" }}>about</div>
          </>
        ) : (
          <>
            <div onClick={() => {setView("home"); setHoverData({active: false})}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, fontFamily: fontBody, fontSize: "0.8rem" }}>giulia</div>
            <div onClick={() => setView("projects")} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, fontFamily: fontBody, fontSize: "0.8rem" }}>projects</div>
            <div onClick={() => setView("about")} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, fontFamily: fontBody, fontSize: "0.8rem" }}>about</div>
          </>
        )}
      </nav>

      <AnimatePresence mode="wait">
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* INFO TÉCNICA */}
            <div style={{ position: "fixed", top: "4vh", right: "4vw", fontFamily: fontTitle, color: kleinBlue, fontSize: "0.85rem", display: "flex", gap: "3rem", zIndex: 1000 }}>
              <span>{selectedProject.info.date}</span>
              <span>{selectedProject.info.location}</span>
              <span>{selectedProject.info.role}</span>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              {/* LADO IZQUIERDO */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 style={{ fontFamily: fontTitle, fontSize: "5vw", color: kleinBlue, lineHeight: "1" }}>{selectedProject.title}</h1>
                <p style={{ fontFamily: fontBody, fontSize: "1.1rem", maxWidth: "24vw", marginTop: "2rem" }}>{selectedProject.desc}</p>
              </div>

              {/* LADO DERECHO: GALERÍA DINÁMICA */}
              <div style={{ width: "65vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "35vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div 
                    key={i} 
                    style={{ 
                      width: (i + 1) % 3 === 0 ? "85vw" : "40vw",
                      alignSelf: (i % 2 === 0 ? "flex-end" : "flex-start"),
                      marginLeft: (i + 1) % 3 === 0 ? "-30vw" : "0"
                    }}
                  >
                    <motion.img 
                      src={item.src} 
                      onMouseEnter={() => setHoverData({ active: true, title: selectedProject.title, text: item.text })}
                      onMouseLeave={() => setHoverData({ ...hoverData, active: false })}
                      style={{ width: "100%", height: (i + 1) % 3 === 0 ? "85vh" : "auto", objectFit: "cover" }} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ... Resto de vistas (Home, Projects, About) ... */}
      </AnimatePresence>
    </main>
  );
}