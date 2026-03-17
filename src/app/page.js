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

  // Estados de posiciones aleatorias
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

  // Posiciones para los 3 párrafos del lado izquierdo en Detail
  const [leftTextPositions, setLeftTextPositions] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);

  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // Galería base
  const customGallery = [
    { url: "/BEAUTIFUL_FAILURES_AY1.jpg", caption: "error de sistema" },
    { url: "/BEAUTIFUL_FAILURES_AY3.jpg", caption: "composición rítmica" },
    { url: "/BEAUTIFUL_FAILURES_AY15.jpg", caption: "textura digital" },
    { url: "/BEAUTIFUL_FAILURES_AY37.jpg", caption: "proceso abierto" },
    { url: "/BEAUTIFUL_FAILURES_AY42.jpg", caption: "interferencia" }
  ];

  // Listado de proyectos
  const projects = [
    { 
      id: 1, 
      title: "24 seconds", 
      img: "/fotos_portadas/Portada_24 seconds.jpg", 
      desc: "una búsqueda de la armonía en el error digital.", 
      info: { date: "2024", location: "barcelona", role: "creative direction" }, 
      gallery: customGallery,
      extraTexts: [
        "la fragmentación del tiempo se convierte en una herramienta de diseño.",
        "exploramos cómo el código puede fallar de manera estética.",
        "el resultado es una simbiosis entre la máquina y el instinto visual."
      ]
    },
    { 
      id: 2, 
      title: "aria libera", 
      img: "/fotos_portadas/Portada_Aria libera.jpg", 
      desc: "la imperfección como lenguaje visual predominante.", 
      info: { date: "2023", location: "milan", role: "art direction" }, 
      gallery: customGallery,
      extraTexts: [
        "espacios que respiran a través de la asimetría.",
        "una oda a lo inacabado y lo efímero.",
        "geometrías que se rompen para encontrar nueva vida."
      ]
    },
    // Añade aquí el resto de tus proyectos con la misma estructura
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
        email: { top: "20vh", left: "15vw", rotate: "5deg" },
        phone: { bottom: "20vh", right: "15vw", rotate: "-8deg" }
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

    if (view === "detail") {
      // Info superior derecha
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "18vw", rotate: (Math.random() * 8 - 4) + "deg" },
        location: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "11vw", rotate: (Math.random() * 8 - 4) + "deg" },
        role: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "4vw", rotate: (Math.random() * 8 - 4) + "deg" }
      });
      // 3 Párrafos izquierda
      setLeftTextPositions([
        { top: Math.floor(Math.random() * 10 + 10) + "vh", left: Math.floor(Math.random() * 5 + 3) + "vw", rotate: (Math.random() * 6 - 3) + "deg" },
        { top: Math.floor(Math.random() * 10 + 45) + "vh", left: Math.floor(Math.random() * 6 + 4) + "vw", rotate: (Math.random() * 6 - 3) + "deg" },
        { top: Math.floor(Math.random() * 10 + 75) + "vh", left: Math.floor(Math.random() * 5 + 3) + "vw", rotate: (Math.random() * 6 - 3) + "deg" }
      ]);
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

      {/* NAVEGACIÓN */}
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

      {/* CURSOR TEXTO */}
      {view === "detail" && selectedProject && (
        <motion.div
          style={{
            position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY,
            pointerEvents: "none", zIndex: 9999, padding: "12px",
            fontFamily: fontTitle, fontSize: "0.6rem", color: kleinBlue,
            textTransform: "lowercase"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredIndex !== null ? `cap-${hoveredIndex}` : 'title'}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.caption || "detalle") : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={customGallery.map(g => g.url)} />
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Crosshair containerRef={containerRef} color={kleinBlue} />
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => openProject(proj)} style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: "150px", cursor: "pointer", zIndex: 10 }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <Crosshair color="#000" />
            <motion.p animate={{ ...aboutPositions.email }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giulia@studio.com</motion.p>
            <motion.p animate={{ ...aboutPositions.phone }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+34 600 000 000</motion.p>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: "2rem", padding: "0 20vw", textAlign: "center" }}>
              <p style={{ fontFamily: fontBody, fontSize: "0.8rem", maxWidth: "400px", lineHeight: "1.6" }}>Directora creativa explorando la intersección entre el error digital y la armonía orgánica.</p>
            </div>
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            
            {/* Header info fija arriba */}
            <div style={{ position: "fixed", width: "100vw", height: "15vh", top: 0, left: 0, zIndex: 1000, pointerEvents: "none" }}>
              <motion.div animate={{ ...detailInfoPositions.date }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>year </span>{selectedProject.info.date} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.location }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>loc </span>{selectedProject.info.location} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.role }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>role </span>{selectedProject.info.role} </motion.div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              {/* Lado Izquierdo: Fijo */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0 }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
                  <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.8" }}>{selectedProject.title}</h1>
                  <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "1rem", maxWidth: "20vw" }}>{selectedProject.desc}</p>
                </div>

                {/* LOS 3 PÁRRAFOS ALEATORIOS */}
                {selectedProject.extraTexts?.map((text, i) => (
                  <motion.p
                    key={i}
                    animate={{ ...leftTextPositions[i] }}
                    transition={{ type: "spring", stiffness: 50 }}
                    style={{ position: "absolute", fontFamily: fontBody, fontSize: "0.65rem", maxWidth: "10vw", lineHeight: "1.5", opacity: 0.4, pointerEvents: "none" }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              {/* Lado Derecho: Imágenes */}
              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div 
                    key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ width: (i + 1) % 3 === 0 ? "100%" : "70%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}
                  >
                    <img src={item.url} style={{ width: "100%", height: "auto" }} />
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