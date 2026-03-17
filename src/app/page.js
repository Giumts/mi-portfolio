"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const containerRef = useRef(null);

  const [navPositions, setNavPositions] = useState({
    giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
    projects: { top: "75vh", left: "15vw", rotate: "4deg" },
    about: { top: "45vh", right: "12vw", rotate: "-3deg" }
  });
  
  const [aboutPositions, setAboutPositions] = useState({
    email: { top: "15vh", left: "10vw", rotate: "5deg" },
    phone: { bottom: "15vh", right: "10vw", rotate: "-8deg" }
  });

  const [detailInfoPositions, setDetailInfoPositions] = useState({
    date: { top: "4vh", right: "15vw", rotate: "0deg" },
    location: { top: "6vh", right: "8vw", rotate: "2deg" },
    role: { top: "4vh", right: "4vw", rotate: "-1deg" }
  });

  const [selectedProject, setSelectedProject] = useState(null);

  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // Galería de ejemplo con subtítulos personalizados
  const customGallery = [
    { url: "/BEAUTIFUL_FAILURES_AY1.jpg", caption: "detalles técnicos" },
    { url: "/BEAUTIFUL_FAILURES_AY3.jpg", caption: "composición rítmica" },
    { url: "/BEAUTIFUL_FAILURES_AY15.jpg", caption: "estudio de color" },
    { url: "/BEAUTIFUL_FAILURES_AY37.jpg", caption: "proceso abierto" },
    { url: "/BEAUTIFUL_FAILURES_AY42.jpg", caption: "texturas digitales" }
  ];

  const projects = [
    { 
      id: 1, 
      title: "24 seconds", 
      img: "/fotos_portadas/Portada_24seconds.jpg", 
      desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", 
      info: { date: "2024", location: "barcelona", role: "creative direction" }, 
      gallery: customGallery 
    },
    { 
      id: 2, 
      title: "aria libera", 
      img: "/fotos_portadas/Portada_Aria libera.jpg", 
      desc: "la imperfección como lenguaje visual predominante.", 
      info: { date: "2023", location: "milan", role: "art direction" }, 
      gallery: customGallery 
    },
    // Añade el resto de tus proyectos aquí con la misma estructura de gallery
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
    if (view === "home") {
      setNavPositions({
        giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
        projects: { top: "75vh", left: "15vw", rotate: "4deg" },
        about: { top: "45vh", right: "12vw", rotate: "-3deg" }
      });
    }
    
    if (view === "about") {
      setAboutPositions({
        email: { 
          top: Math.floor(Math.random() * 20 + 10) + "vh", 
          left: Math.floor(Math.random() * 50 + 5) + "vw", 
          rotate: Math.floor(Math.random() * 20 - 10) + "deg" 
        },
        phone: { 
          bottom: Math.floor(Math.random() * 20 + 10) + "vh", 
          right: Math.floor(Math.random() * 50 + 5) + "vw", 
          rotate: Math.floor(Math.random() * 20 - 10) + "deg" 
        }
      });
    }

    if (view === "detail") {
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "18vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" },
        location: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "11vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" },
        role: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "4vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" }
      });
    }

    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: Math.floor(Math.random() * 10 - 5) + "deg",
      }));
      setProjectPositions(positions);
    }
  }, [view]);

  const openProject = (proj) => {
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      <nav>
        <AnimatePresence>
          {view === "home" ? (
            <>
              <motion.h1 onClick={() => setView("home")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.giulia }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.9rem", textDecoration: "line-through", zIndex: 1000, cursor: "pointer" }}>giulia</motion.h1>
              <motion.div onClick={() => setView("projects")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.projects }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>projects</motion.div>
              <motion.div onClick={() => setView("about")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.about }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>about</motion.div>
            </>
          ) : (
            <div style={{ fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase" }}>
              <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
              <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
              <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      {/* TEXTO DINÁMICO CURSOR (Detail) */}
      {view === "detail" && selectedProject && (
        <motion.div
          style={{
            position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY,
            pointerEvents: "none", zIndex: 9999, padding: "12px",
            fontFamily: fontTitle, fontSize: "0.6rem", color: kleinBlue,
            textTransform: "lowercase"
          }}
        >
          {hoveredIndex !== null 
            ? (selectedProject.gallery[hoveredIndex]?.caption || "detalle") 
            : selectedProject.title}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ... (Home, Projects, About se mantienen igual) ... */}
        {view === "home" && ( <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}><ImageTrail images={customGallery.map(g => g.url)} /></motion.div> )}
        
        {/* VIEW: PROJECTS (Omitido para brevedad, sigue igual que antes) */}

        {/* VIEW: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            
            {/* Header info random */}
            <div style={{ position: "fixed", width: "100vw", height: "15vh", top: 0, left: 0, zIndex: 1000, pointerEvents: "none" }}>
              <motion.div animate={{ ...detailInfoPositions.date }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem", color: "#000" }}> <span style={{ opacity: 0.4 }}>year </span>{selectedProject.info.date} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.location }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem", color: "#000" }}> <span style={{ opacity: 0.4 }}>loc </span>{selectedProject.info.location} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.role }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem", color: "#000" }}> <span style={{ opacity: 0.4 }}>role </span>{selectedProject.info.role} </motion.div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4vw" }}>
                <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.9", marginBottom: "2rem" }}>{selectedProject.title}</h1>
                <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "24vw", lineHeight: "1.6" }}>{selectedProject.desc}</p>
              </div>

              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div 
                    key={i} 
                    onMouseEnter={() => setHoveredIndex(i)} 
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.8 }} 
                    style={{ 
                        width: (i + 1) % 3 === 0 ? "100%" : "70%", 
                        alignSelf: i % 2 === 0 ? "flex-end" : "flex-start",
                    }}
                  >
                    <img src={item.url} style={{ width: "100%", height: "auto", display: "block" }} />
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