"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [projectPositions, setProjectPositions] = useState([]);
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [navPositions, setNavPositions] = useState({
    giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
    projects: { top: "75vh", left: "15vw", rotate: "4deg" },
    about: { top: "45vh", right: "12vw", rotate: "-3deg" }
  });

  const springConfig = { stiffness: 150, damping: 20 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

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

  // Mouse Follower Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Reset Scroll on View Change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: Math.floor(Math.random() * 12 - 6) + "deg",
      }));
      setProjectPositions(positions);
    }
  }, [view]);

  const openProject = (proj) => {
    setSelectedProject(proj);
    setView("detail");
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * {
          margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased;
          cursor: crosshair !important;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NAVEGACIÓN GLOBAL */}
      <nav style={{ pointerEvents: "none" }}>
        <AnimatePresence>
          {view === "home" ? (
            <div style={{ pointerEvents: "auto" }}>
              <motion.h1 onClick={() => setView("home")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.giulia }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.9rem", textDecoration: "line-through", zIndex: 1000, cursor: "pointer" }}>giulia</motion.h1>
              <motion.div onClick={() => setView("projects")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.projects }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>projects</motion.div>
              <motion.div onClick={() => setView("about")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.about }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>about</motion.div>
            </div>
          ) : (
            <div style={{ fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase", pointerEvents: "auto" }}>
              <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
              <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
              <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {/* VIEW: HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {/* VIEW: PROJECTS */}
        {view === "projects" && (
          <motion.div key="projects" ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Crosshair containerRef={containerRef} color={kleinBlue} />
            {projects.map((proj, index) => (
              <motion.div 
                key={proj.id} 
                className="project-item" 
                onClick={() => openProject(proj)} 
                style={{ 
                  position: "absolute", 
                  top: projectPositions[index]?.top, 
                  left: projectPositions[index]?.left, 
                  rotate: projectPositions[index]?.rotation, 
                  width: "150px", 
                  cursor: "pointer", 
                }}
                whileHover={{ zIndex: 50 }}
              >
                <motion.img 
                  src={proj.img} 
                  whileHover={{ scale: 1.05 }} 
                  style={{ width: "100%", filter: "grayscale(100%)", transition: "filter 0.3s ease" }} 
                  onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} 
                  onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} 
                />
                <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VIEW: ABOUT */}
        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <Crosshair color="#000" />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: "2rem", padding: "0 20vw", textAlign: "center" }}>
              <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "300px", lineHeight: "1.5" }}>giulia es una directora creativa con base en barcelona, enfocada en la intersección entre el diseño digital y la imperfección orgánica.</p>
              <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "300px", lineHeight: "1.5" }}>su trabajo explora el error como una herramienta estética, buscando la armonía en procesos inacabados y texturas visuales crudas.</p>
              <div style={{ marginTop: "2rem" }}>
                <p style={{ fontFamily: fontTitle, fontSize: "0.7rem", color: kleinBlue }}>giulia@example.com</p>
                <p style={{ fontFamily: fontTitle, fontSize: "0.7rem", color: kleinBlue }}>+34 000 000 000</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh", width: "100%" }}>
            <Crosshair color={kleinBlue} />
            
            {/* INFO FLOTANTE */}
            <div style={{ position: "fixed", top: "4vh", right: "4vw", fontFamily: fontTitle, fontSize: "0.7rem", color: kleinBlue, zIndex: 1000, display: "flex", gap: "3rem", textAlign: "right" }}>
              <div style={{ display: "flex", flexDirection: "column" }}><span style={{ opacity: 0.5 }}>year</span><span>{selectedProject.info.date}</span></div>
              <div style={{ display: "flex", flexDirection: "column" }}><span style={{ opacity: 0.5 }}>location</span><span>{selectedProject.info.location}</span></div>
              <div style={{ display: "flex", flexDirection: "column" }}><span style={{ opacity: 0.5 }}>role</span><span>{selectedProject.info.role}</span></div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              {/* COLUMNA IZQUIERDA (FIJA) */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.9", marginBottom: "2rem", textTransform: "lowercase" }}>{selectedProject.title}</h1>
                <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "24vw", lineHeight: "1.6" }}>{selectedProject.desc}</p>
                <motion.div 
                  onClick={() => setView("projects")} 
                  whileHover={{ x: -5, color: kleinBlue }} 
                  style={{ marginTop: "3rem", fontFamily: fontTitle, fontSize: "0.7rem", cursor: "pointer" }}
                >
                  ← back to projects
                </motion.div>
              </div>

              {/* COLUMNA DERECHA (SCROLL) */}
              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "25vh" }}>
                {[selectedProject.img, ...selectedProject.gallery].map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }} 
                    style={{ 
                      width: i % 3 === 0 ? "100%" : "75%", 
                      alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" 
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}