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

  // Estados de posiciones para elementos dinámicos
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

  const [leftTextPositions, setLeftTextPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // Galería base para el ImageTrail y Galerías de proyecto
  const trailImages = [
    { url: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "error de sistema" },
    { url: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "composición rítmica" },
    { url: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "textura digital" },
    { url: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "proceso abierto" },
    { url: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "interferencia" },
    { url: "/BEAUTIFUL_FAILURES_AY49.jpg", text: "abstracción" },
    { url: "/BEAUTIFUL_FAILURES_AY51.jpg", text: "luz y ruido" },
    { url: "/BEAUTIFUL_FAILURES_AY59.jpg", text: "fragmentos" },
    { url: "/BEAUTIFUL_FAILURES_AY71.jpg", text: "espacio negativo" },
    { url: "/BEAUTIFUL_FAILURES_AY75.jpg", text: "estática visual" },
    { url: "/BEAUTIFUL_FAILURES_AY9.jpg", text: "final inacabado" }
  ];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, gallery: trailImages, extraTexts: ["la fragmentación del tiempo se vuelve diseño.", "exploramos cómo el código falla estéticamente.", "simbiosis entre máquina e instinto."] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje predominante.", info: { date: "2023", location: "milan", role: "art direction" }, gallery: trailImages, extraTexts: ["espacios que respiran asimetría.", "oda a la belleza de lo efímero.", "geometrías que se rompen."] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio.", info: { date: "2024", location: "madrid", role: "visual design" }, gallery: trailImages, extraTexts: ["el lienzo blanco es un campo de fuerza.", "ritmos que nacen de la repetición.", "anomalía que genera estética."] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "el contraste define la forma.", info: { date: "2022", location: "london", role: "creative lead" }, gallery: trailImages, extraTexts: ["luz y sombra esculpiendo identidad.", "estudio sobre legibilidad extrema.", "reducción a la esencia lumínica."] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada al diseño.", info: { date: "2023", location: "berlin", role: "photography" }, gallery: trailImages, extraTexts: ["realidad bajo filtro geométrico.", "descomponer el entorno urbano.", "lo invisible en lo cotidiano."] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "fragmentos de un proceso.", info: { date: "2024", location: "paris", role: "concept" }, gallery: trailImages, extraTexts: ["evolución en work in progress.", "transformación formal y ascendente.", "texturas que narran su creación."] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, gallery: trailImages, extraTexts: ["tensión entre quieto y dinámico.", "movimiento congelado en patrones.", "cinemática en imagen fija."] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, gallery: trailImages, extraTexts: ["máxima limpieza y claridad.", "eliminación de lo superfluo.", "eficiencia con el mínimo elemento."] }
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
      setNavPositions({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
    }
    if (view === "projects") {
      const positions = projects.map(() => ({ top: Math.floor(Math.random() * 60 + 15) + "vh", left: Math.floor(Math.random() * 70 + 10) + "vw", rotation: Math.floor(Math.random() * 10 - 5) + "deg" }));
      setProjectPositions(positions);
    }
    if (view === "detail") {
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "18vw", rotate: (Math.random() * 6 - 3) + "deg" },
        location: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "11vw", rotate: (Math.random() * 6 - 3) + "deg" },
        role: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "4vw", rotate: (Math.random() * 6 - 3) + "deg" }
      });
      setLeftTextPositions([
        { top: Math.floor(Math.random() * 10 + 10) + "vh", left: Math.floor(Math.random() * 5 + 2) + "vw", rotate: (Math.random() * 10 - 5) + "deg" },
        { top: Math.floor(Math.random() * 10 + 40) + "vh", left: Math.floor(Math.random() * 8 + 4) + "vw", rotate: (Math.random() * 10 - 5) + "deg" },
        { top: Math.floor(Math.random() * 10 + 70) + "vh", left: Math.floor(Math.random() * 5 + 2) + "vw", rotate: (Math.random() * 10 - 5) + "deg" }
      ]);
    }
  }, [view]);

  const openProject = (proj) => { setSelectedProject(proj); setView("detail"); window.scrollTo({ top: 0, behavior: 'instant' }); };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: crosshair !important; }
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
              <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer" }}>giulia</div>
              <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
              <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      {/* CURSOR DINÁMICO */}
      {view === "detail" && selectedProject && (
        <motion.div style={{ position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999, padding: "12px", fontFamily: fontTitle, fontSize: "0.6rem", color: kleinBlue, textTransform: "lowercase" }}>
          <AnimatePresence mode="wait">
            <motion.span key={hoveredIndex !== null ? `cap-${hoveredIndex}` : 'title'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
              {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* VISTA: HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages.map(img => img.url)} />
          </motion.div>
        )}

        {/* VISTA: PROJECTS */}
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

        {/* VISTA: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            
            <div style={{ position: "fixed", width: "100vw", height: "15vh", top: 0, left: 0, zIndex: 1000, pointerEvents: "none" }}>
              <motion.div animate={{ ...detailInfoPositions.date }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>year </span>{selectedProject.info.date} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.location }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>loc </span>{selectedProject.info.location} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.role }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>role </span>{selectedProject.info.role} </motion.div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0 }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
                    <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.8" }}>{selectedProject.title}</h1>
                    <p style={{ fontFamily: fontBody, fontSize: "0.85rem", marginTop: "1rem", maxWidth: "20vw", opacity: 0.8 }}>{selectedProject.desc}</p>
                </div>

                {selectedProject.extraTexts?.map((t, i) => (
                  <motion.p 
                    key={i} 
                    animate={{ ...leftTextPositions[i], y: [0, -8, 0] }} 
                    transition={{ ...leftTextPositions[i], y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 } }}
                    style={{ position: "absolute", fontFamily: fontBody, fontSize: "0.7rem", maxWidth: "12vw", lineHeight: "1.4", opacity: 0.5, pointerEvents: "none" }}
                  >
                    {t}
                  </motion.p>
                ))}
              </div>

              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ width: (i + 1) % 3 === 0 ? "100%" : "70%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}>
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