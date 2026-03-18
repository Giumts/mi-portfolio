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

  // NUEVO: Estado para las posiciones aleatorias de los 3 párrafos de la izquierda
  const [leftTextPositions, setLeftTextPositions] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);

  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // Galería base para ImageTrail y Galerías de proyecto
  const trailImages = [
    { url: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "error de sistema" },
    { url: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "composición rítmica" },
    { url: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "textura digital" },
    { url: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "proceso abierto" },
    { url: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "interferencia visual" }
  ];

  // Listado completo de los 8 proyectos con textos extra densos
  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, gallery: trailImages, extraTexts: ["la fragmentación del tiempo se convierte en una herramienta de diseño, donde cada segundo cuenta una historia de distorsión formal.", "exploramos cómo el código puede fallar de manera estética, creando patrones que el ojo humano no podría concebir por sí solo.", "el resultado es una simbiosis entre la máquina y el instinto visual, un archivo de lo que sucede cuando dejas de buscar la perfección."] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, gallery: trailImages, extraTexts: ["espacios que respiran a través de la asimetría y el vacío visual, creando tensiones entre lo que está y lo que falta.", "una oda a la belleza de lo efímero y lo incompleto en la era digital, buscando la honestidad en cada pixel.", "geometrías que se rompen para encontrar una nueva forma de equilibrio, desafiando la limpieza convencional."] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio en blanco.", info: { date: "2024", location: "madrid", role: "visual design" }, gallery: trailImages, extraTexts: ["el lienzo no es un vacío, sino un campo de fuerza donde el error encuentra su lugar y su propósito.", "ritmos visuales que nacen de la repetición del fallo y la sutil variación de la anomalía digital.", "investigación sobre cómo la anomalía digital genera nuevas estéticas de diseño, rompiendo la cuadrícula establecida."] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "el contraste extremo define la forma.", info: { date: "2022", location: "london", role: "creative lead" }, gallery: trailImages, extraTexts: ["la luz y la sombra llevadas al límite para esculpir la identidad visual, creando formas que emergen de la oscuridad.", "un estudio sobre la legibilidad extrema y la abstracción en entornos de alto contraste y mínimo detalle.", "reducción de la forma a su esencia lumínica y matérica pura, eliminando todo lo superfluo de la interfaz."] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada al diseño contemporáneo.", info: { date: "2023", location: "berlin", role: "photography" }, gallery: trailImages, extraTexts: ["capturando la realidad tras un filtro geométrico que deconstruye la imagen, creando una nueva sintaxis visual.", "la fotografía descompone y reensambla el entorno urbano en patrones abstractos que desafían la percepción.", "una mirada que busca lo invisible en lo cotidiano, revelando la estructura subyacente del mundo visual."] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "fragmentos de un proceso inacabado.", info: { date: "2024", location: "paris", role: "concept" }, gallery: trailImages, extraTexts: ["la belleza de la evolución constante, capturada en un estado de 'work in progress' que nunca se detiene.", "exploración conceptual sobre la transformación formal y la ascendencia visual de los elementos de diseño.", "texturas visuales que narran la historia de su propia creación y error, un archivo de lo inacabado."] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "capturando la esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, gallery: trailImages, extraTexts: ["tensión visual entre lo quieto y lo dinámico, capturando la energía latente en la imagen fija.", "el movimiento congelado en patrones ocultos que desafían la percepción del tiempo y el espacio.", "una producción visual que explora la cinemática a través de la imagen fija, creando un diálogo entre ambas."] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, gallery: trailImages, extraTexts: ["la interfaz como espacio de máxima claridad visual y orden, donde la función define la forma.", "eliminación de lo superfluo para centrar la atención en la interacción y el contenido.", "estética de diseño que busca la máxima eficiencia visual con el mínimo elemento, un minimalismo radical."] }
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
    if (view === "about") {
      setAboutPositions({
        email: { top: Math.floor(Math.random() * 20 + 10) + "vh", left: Math.floor(Math.random() * 50 + 5) + "vw", rotate: (Math.random() * 20 - 10) + "deg" },
        phone: { bottom: Math.floor(Math.random() * 20 + 10) + "vh", right: Math.floor(Math.random() * 50 + 5) + "vw", rotate: (Math.random() * 20 - 10) + "deg" }
      });
    }
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: (Math.random() * 10 - 5) + "deg",
      }));
      setProjectPositions(positions);
    }
    if (view === "detail") {
      // Info superior derecha
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "18vw", rotate: (Math.random() * 6 - 3) + "deg" },
        location: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "11vw", rotate: (Math.random() * 6 - 3) + "deg" },
        role: { top: Math.floor(Math.random() * 4 + 2) + "vh", right: "4vw", rotate: (Math.random() * 6 - 3) + "deg" }
      });
      // NUEVO: Generar posiciones random para los 3 párrafos de la izquierda
      setLeftTextPositions([
        { top: Math.floor(Math.random() * 10 + 10) + "vh", left: Math.floor(Math.random() * 5 + 3) + "vw", rotate: (Math.random() * 10 - 5) + "deg" },
        { top: Math.floor(Math.random() * 10 + 40) + "vh", left: Math.floor(Math.random() * 6 + 4) + "vw", rotate: (Math.random() * 10 - 5) + "deg" },
        { top: Math.floor(Math.random() * 10 + 70) + "vh", left: Math.floor(Math.random() * 5 + 3) + "vw", rotate: (Math.random() * 10 - 5) + "deg" }
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
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: crosshair !important; }
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
            <motion.span key={hoveredIndex !== null ? `text-${hoveredIndex}` : 'title'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
              {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* VIEW: HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages.map(img => img.url)} />
          </motion.div>
        )}

        {/* VIEW: PROJECTS */}
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

        {/* VIEW: ABOUT */}
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

        {/* VIEW: DETAIL */}
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
                  <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "1rem", maxWidth: "20vw", lineHeight: "1.4", opacity: 0.8 }}>{selectedProject.desc}</p>
                </div>
                {/* LOS 3 PÁRRAFOS DENSOS, ALEATORIOS Y FLOTANTES */}
                {selectedProject.extraTexts?.map((text, i) => (
                  <motion.p 
                    key={i} 
                    animate={{ 
                      ...leftTextPositions[i],
                      y: [0, -15, 0] // Efecto de flotación sutil
                    }} 
                    transition={{ 
                      ...leftTextPositions[i], 
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 } 
                    }}
                    style={{ position: "absolute", fontFamily: fontBody, fontSize: "0.7rem", maxWidth: "15vw", lineHeight: "1.6", opacity: 0.5, pointerEvents: "none" }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ width: (i + 1) % 3 === 0 ? "100%" : "70%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}>
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