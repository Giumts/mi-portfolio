"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clipPath, setClipPath] = useState("inset(10% 20% 10% 20%)");
  const [isHovering, setIsHovering] = useState(false);

  // Muelle para el custom cursor (más rápido y reactivo)
  const springConfig = { stiffness: 250, damping: 25 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", "/BEAUTIFUL_FAILURES_AY9.jpg"];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24seconds.jpg", desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", gallery: trailImages },
    { id: 2, title: "Aria Libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual predominante.", gallery: trailImages },
    { id: 3, title: "Beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio en blanco.", gallery: trailImages },
    { id: 4, title: "LedsC4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "el contraste extremo define la forma.", gallery: trailImages },
    { id: 5, title: "Now you see me Moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada al diseño contemporáneo.", gallery: trailImages },
    { id: 6, title: "Rise Up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "fragmentos de un proceso inacabado.", gallery: trailImages },
    { id: 7, title: "San Sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "capturando la esencia del movimiento estático.", gallery: trailImages },
    { id: 8, title: "Vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción visual al mínimo exponente.", gallery: trailImages },
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

  const openProject = (proj) => {
    const r = () => Math.floor(Math.random() * 25);
    setClipPath(`inset(${r()}% ${r()}% ${r()}% ${r()}%)`);
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ESTILO DE TEXTO PARA NAV (ALTE HAAS)
  const navTextStyle = {
    position: "fixed",
    fontSize: "0.85rem",
    letterSpacing: "1px",
    textTransform: "lowercase",
    fontFamily: "'Alte Haas Grotesk', sans-serif",
    zIndex: 1000, 
    color: "#000",
    cursor: "crosshair",
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative" }}>
      
      <style jsx global>{`
        @font-face {
          font-family: 'Alte Haas Grotesk';
          src: url('/fonts/AlteHaasGroteskRegular.ttf') format('truetype');
        }
        body, html, * { 
          cursor: crosshair !important; 
          margin: 0; 
          padding: 0; 
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* CURSOR FLOTANTE (SOLO EN DETAIL) */}
      <AnimatePresence>
        {isHovering && view === "detail" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              x: mouseX,
              y: mouseY,
              marginLeft: "20px",
              marginTop: "20px",
              zIndex: 9999,
              pointerEvents: "none",
              color: "#000",
              fontFamily: "'Alte Haas Grotesk', sans-serif",
              textTransform: "lowercase"
            }}
          >
            <p style={{ fontSize: "2rem", fontWeight: "bold", lineHeight: "0.9" }}>
              {selectedProject?.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV RESTAURADA (CENTRAL EN HOME, ESQUINAS EN DETAIL) */}
      <nav>
        {view === "home" ? (
          // HOME CENTRAL (CON SERIF)
          <AnimatePresence>
            <motion.h1 
              onClick={() => {setView("home"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", top: "5vh", width: "100%", textAlign: "center", textDecoration: "line-through", fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "serif", zIndex: 1000, color: "#1a1a1a", cursor: "crosshair" }}>giulia</motion.h1>
            <motion.div 
              onClick={() => {setView("projects"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", bottom: "5vh", width: "100%", textAlign: "center", fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "serif", zIndex: 1000, color: "#1a1a1a", cursor: "crosshair" }}>projects</motion.div>
            <motion.div 
              onClick={() => {setView("about"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", right: "8vw", top: "40%", transform: "translateY(-50%)", fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "serif", zIndex: 1000, color: "#1a1a1a", cursor: "crosshair" }}>about</motion.div>
          </AnimatePresence>
        ) : (
          // DETAIL/PROJECTS/ABOUT EN ESQUINAS (CON ALTE HAAS)
          <>
            <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ ...navTextStyle, top: "4vh", left: "4vw", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
            <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ ...navTextStyle, bottom: "4vh", left: "4vw", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
            <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ ...navTextStyle, bottom: "4vh", right: "4vw", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
          </>
        )}
      </nav>

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh", overflow: "hidden"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", fontFamily: "'Alte Haas Grotesk', sans-serif" }}>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => openProject(proj)} style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "140px", textAlign: "left" }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ marginTop: "8px", fontSize: "0.7rem", color: "#000", textTransform: "lowercase" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", fontFamily: "'Alte Haas Grotesk', sans-serif" }}>
            
            {/* SECCIÓN DINÁMICA DE DETALLE */}
            <div style={{ display: "flex", flexDirection: "row", minHeight: "200vh", padding: "0 4vw" }}>
              
              {/* LADO IZQUIERDO: STICKY INFO */}
              <div style={{ width: "30vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 style={{ fontSize: "3vw", fontWeight: "bold", textTransform: "lowercase", lineHeight: "1", marginBottom: "2rem", color: "#000" }}>{selectedProject.title}</h1>
                <p style={{ fontSize: "1rem", maxWidth: "20vw", lineHeight: "1.4", color: "#333" }}>{selectedProject.desc}</p>
              </div>

              {/* LADO DERECHO: GALERÍA ASIMÉTRICA */}
              <div style={{ width: "70vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((img, i) => {
                  const isFullScreen = (i + 1) % 3 === 0;
                  const isRight = i % 2 === 0;

                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      style={{ 
                        width: isFullScreen ? "92vw" : "35vw",
                        alignSelf: isFullScreen ? "center" : (isRight ? "flex-end" : "flex-start"),
                        marginLeft: isFullScreen ? "-26vw" : "0", 
                        zIndex: isFullScreen ? 10 : 1
                      }}
                    >
                      <motion.img 
                        src={img} 
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        style={{ 
                          width: "100%", 
                          height: isFullScreen ? "80vh" : "auto", 
                          objectFit: "cover",
                          filter: "grayscale(10%)"
                        }} 
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div style={{ height: "50vh" }} />
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", fontFamily: "'Alte Haas Grotesk', sans-serif" }}>
            <div style={{ maxWidth: "600px", textAlign: "left", padding: "0 4vw" }}>
              <p style={{ fontSize: "2.5rem", lineHeight: "1.1", marginBottom: "2rem", fontWeight: "bold", color: "#000" }}>giulia es una directora creativa enfocada en la estética de la imperfección.</p>
              <div style={{ fontSize: "1.1rem", lineHeight: "1.5", display: "flex", gap: "4rem", color: "#000" }}>
                <p>giulia@example.com</p>
                <p>+34 000 000 000</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
