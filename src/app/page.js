"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { stiffness: 250, damping: 25 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const trailImages = [
    "/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", 
    "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", 
    "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", 
    "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", 
    "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", 
    "/BEAUTIFUL_FAILURES_AY9.jpg"
  ];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24seconds.jpg", desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", info: { date: "2024", location: "barcelona", role: "creative direction" }, gallery: trailImages },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, gallery: trailImages },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio en blanco.", info: { date: "2024", location: "madrid", role: "visual design" }, gallery: trailImages },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "el contraste extremo define la forma.", info: { date: "2022", location: "london", role: "creative lead" }, gallery: trailImages },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada al diseño contemporáneo.", info: { date: "2023", location: "berlin", role: "photography" }, gallery: trailImages },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "fragmentos de un proceso inacabado.", info: { date: "2024", location: "paris", role: "concept" }, gallery: trailImages },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "capturando la esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, gallery: trailImages },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, gallery: trailImages },
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
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const lightTextStyle = {
    fontFamily: "'Roundo ExtraLight', sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "0.05em",
    textTransform: "lowercase",
    color: "#000",
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative" }}>
      
      <style jsx global>{`
        @font-face {
          font-family: 'Roundo Bold';
          src: url('/fonts/Roundo-Bold.otf') format('opentype');
          font-weight: bold;
        }
        @font-face {
          font-family: 'Roundo ExtraLight';
          src: url('/fonts/Roundo-ExtraLight.otf') format('opentype');
          font-weight: 200;
        }
        body, html, * { 
          cursor: crosshair !important; 
          margin: 0; 
          padding: 0; 
          color: #000;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* CURSOR FLOTANTE */}
      <AnimatePresence>
        {isHovering && view === "detail" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", x: mouseX, y: mouseY,
              marginLeft: "25px", marginTop: "25px",
              zIndex: 9999, pointerEvents: "none",
              fontFamily: "'Roundo Bold', sans-serif",
              fontSize: "3rem", lineHeight: "0.8",
              textTransform: "lowercase", color: "#000"
            }}
          >
            {selectedProject?.title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVEGACIÓN */}
      <nav>
        {view === "home" ? (
          <AnimatePresence>
            <motion.h1 
              onClick={() => {setView("home"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: "fixed", top: "5vh", width: "100%", textAlign: "center", textDecoration: "line-through", fontSize: "0.75rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Roundo ExtraLight', sans-serif", zIndex: 1000 }}>giulia</motion.h1>
            <motion.div 
              onClick={() => {setView("projects"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: "fixed", bottom: "5vh", width: "100%", textAlign: "center", fontSize: "0.75rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Roundo ExtraLight', sans-serif", zIndex: 1000 }}>projects</motion.div>
            <motion.div 
              onClick={() => {setView("about"); setSelectedProject(null);}} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: "fixed", right: "8vw", top: "40%", transform: "translateY(-50%)", fontSize: "0.75rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Roundo ExtraLight', sans-serif", zIndex: 1000 }}>about</motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ ...lightTextStyle, position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
            <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ ...lightTextStyle, position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
            <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ ...lightTextStyle, position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
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
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh" }}>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => openProject(proj)} style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "140px" }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ ...lightTextStyle, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", position: "relative" }}>
            
            {/* INFO TÉCNICA (UNA SOLA LÍNEA HORIZONTAL - ARRIBA A LA DERECHA) */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{
                position: "fixed", 
                top: "4vh", 
                right: "4vw", 
                fontFamily: "'Roundo Bold', sans-serif",
                fontSize: "0.85rem",
                textTransform: "lowercase",
                color: "#000",
                zIndex: 1000,
                display: "flex",
                gap: "2rem" // Espacio entre los elementos
              }}
            >
              <span>{selectedProject.info.date}</span>
              <span>{selectedProject.info.location}</span>
              <span>{selectedProject.info.role}</span>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "row", minHeight: "200vh", padding: "0 4vw" }}>
              
              {/* LADO IZQUIERDO: STICKY INFO PRINCIPAL */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 style={{ fontFamily: "'Roundo Bold', sans-serif", fontSize: "4.5vw", textTransform: "lowercase", lineHeight: "0.85", marginBottom: "2.5rem" }}>{selectedProject.title}</h1>
                <p style={{ ...lightTextStyle, fontSize: "1.1rem", maxWidth: "24vw", lineHeight: "1.4" }}>{selectedProject.desc}</p>
              </div>

              {/* LADO DERECHO: GALERÍA ASIMÉTRICA */}
              <div style={{ width: "65vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "35vh" }}>
                {[selectedProject.img, ...selectedProject.gallery].map((img, i) => (
                  <motion.div 
                    key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }}
                    style={{ 
                      width: (i + 1) % 3 === 0 ? "85vw" : "40vw",
                      alignSelf: (i % 2 === 0 ? "flex-end" : "flex-start"),
                      marginLeft: (i + 1) % 3 === 0 ? "-30vw" : "0",
                      zIndex: (i + 1) % 3 === 0 ? 10 : 1
                    }}
                  >
                    <motion.img 
                      src={img} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                      style={{ width: "100%", height: (i + 1) % 3 === 0 ? "85vh" : "auto", objectFit: "cover" }} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ height: "60vh" }} />
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
            <div style={{ maxWidth: "800px", padding: "0 4vw" }}>
              <p style={{ fontFamily: "'Roundo Bold', sans-serif", fontSize: "4rem", lineHeight: "0.85", marginBottom: "3rem" }}>giulia es una directora creativa enfocada en la estética de la imperfección.</p>
              <div style={{ ...lightTextStyle, fontSize: "1.3rem", display: "flex", gap: "5rem" }}>
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