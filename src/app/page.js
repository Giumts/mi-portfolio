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

  // ... (Tus estados de posiciones se mantienen igual)
  const [navPositions, setNavPositions] = useState({
    giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
    projects: { top: "75vh", left: "15vw", rotate: "4deg" },
    about: { top: "45vh", right: "12vw", rotate: "-3deg" }
  });
  const [detailInfoPositions, setDetailInfoPositions] = useState({
    date: { top: "4vh", right: "15vw", rotate: "0deg" },
    location: { top: "6vh", right: "8vw", rotate: "2deg" },
    role: { top: "4vh", right: "4vw", rotate: "-1deg" }
  });

  const [selectedProject, setSelectedProject] = useState(null);

  // Configuración de movimiento del cursor
  const springConfig = { stiffness: 200, damping: 25 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // DATOS: Ahora cada imagen tiene su propio "caption" personalizado
  const projects = [
    { 
      id: 1, 
      title: "24 seconds", 
      img: "/fotos_portadas/Portada_24seconds.jpg", 
      desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", 
      info: { date: "2024", location: "barcelona", role: "creative direction" }, 
      gallery: [
        { url: "/BEAUTIFUL_FAILURES_AY1.jpg", caption: "fragmento 01" },
        { url: "/BEAUTIFUL_FAILURES_AY3.jpg", caption: "error controlado" },
        { url: "/BEAUTIFUL_FAILURES_AY15.jpg", caption: "textura orgánica" },
        { url: "/BEAUTIFUL_FAILURES_AY37.jpg", caption: "offset visual" },
      ]
    },
    // ... otros proyectos
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // (useEffect de cambio de vista omitido para brevedad, mantenlo igual)
  useEffect(() => {
    if (view === "detail") {
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "18vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" },
        location: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "11vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" },
        role: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "4vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" }
      });
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

      {/* NAVEGACIÓN (Giulia, Projects, About) */}
      <nav>
        {/* ... (Tu componente nav actual) ... */}
      </nav>

      {/* CURSOR DINÁMICO: Texto que acompaña a la cruz */}
      {view === "detail" && selectedProject && (
        <motion.div
          style={{
            position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY,
            pointerEvents: "none", zIndex: 9999, padding: "12px",
            fontFamily: fontTitle, fontSize: "0.6rem", color: kleinBlue,
            textTransform: "lowercase", display: "flex", alignItems: "center"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredIndex !== null ? `cap-${hoveredIndex}` : 'title'}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {hoveredIndex !== null 
                ? selectedProject.gallery[hoveredIndex]?.caption 
                : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* VISTAS: HOME / PROJECTS / ABOUT */}
        {/* ... (Omitidas para centrar la atención en Detail) ... */}

        {/* VIEW: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            
            {/* Header info (Date, Location, Role) */}
            <div style={{ position: "fixed", width: "100vw", height: "15vh", top: 0, left: 0, zIndex: 1000, pointerEvents: "none" }}>
              <motion.div animate={{ ...detailInfoPositions.date }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>year </span>{selectedProject.info.date} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.location }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>loc </span>{selectedProject.info.location} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.role }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>role </span>{selectedProject.info.role} </motion.div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              {/* Columna Izquierda: Info fija */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4vw" }}>
                <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.9", marginBottom: "2rem" }}>{selectedProject.title}</h1>
                <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "24vw", lineHeight: "1.6" }}>{selectedProject.desc}</p>
              </div>

              {/* Columna Derecha: Galería Scrollable */}
              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div 
                    key={i} 
                    onMouseEnter={() => setHoveredIndex(i)} 
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-10%" }} 
                    style={{ 
                        width: (i + 1) % 3 === 0 ? "100%" : "75%", 
                        alignSelf: i % 2 === 0 ? "flex-end" : "flex-start",
                    }}
                  >
                    <img src={item.url} style={{ width: "100%", height: "auto", display: "block" }} alt={item.caption} />
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