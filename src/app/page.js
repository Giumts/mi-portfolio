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

  // Estados para las posiciones random de la info superior en detalle
  const [detailInfoPositions, setDetailInfoPositions] = useState({
    date: { top: "4vh", right: "15vw", rotate: "0deg" },
    location: { top: "6vh", right: "8vw", rotate: "2deg" },
    role: { top: "4vh", right: "4vw", rotate: "-1deg" }
  });

  // Otros estados de posición (About, Nav) - Omitidos por brevedad, mantenlos igual
  const [navPositions, setNavPositions] = useState({ giulia: {}, projects: {}, about: {} });
  const [aboutPositions, setAboutPositions] = useState({ email: {}, phone: {} });

  const [selectedProject, setSelectedProject] = useState(null);

  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Monor', monospace";
  const fontBody = "'Roundo', sans-serif";

  // --- ESTRUCTURA DE GALERÍA BASE (Muestra) ---
  const customGallery = [
    { url: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "error de sistema" },
    { url: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "composición rítmica" },
    { url: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "textura digital" },
    { url: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "proceso abierto" },
    { url: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "interferencia visual" }
  ];

  // --- LISTADO COMPLETO DE PROYECTOS ---
  const projects = [
    { 
      id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", 
      desc: "una búsqueda de la armonía en el error digital y la composición orgánica.", 
      info: { date: "2024", location: "barcelona", role: "creative direction" }, 
      gallery: customGallery,
      extraTexts: [
        "la fragmentación del tiempo se convierte en una herramienta de diseño, donde cada segundo cuenta una historia de distorsión.",
        "exploramos cómo el código puede fallar de manera estética, creando patrones que el ojo humano no podría concebir por sí solo.",
        "el resultado es una simbiosis entre la máquina y el instinto visual, un archivo de lo inacabado."
      ]
    },
    { 
      id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", 
      desc: "la imperfección como lenguaje visual predominante.", 
      info: { date: "2023", location: "milan", role: "art direction" }, 
      gallery: customGallery,
      extraTexts: [
        "espacios que respiran a través de la asimetría y el vacío.",
        "una oda a la belleza de lo efímero y lo incompleto.",
        "geometrías que se rompen para encontrar una nueva forma de equilibrio visual."
      ]
    },
    { 
      id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", 
      desc: "exploración rítmica del espacio en blanco.", 
      info: { date: "2024", location: "madrid", role: "visual design" }, 
      gallery: customGallery,
      extraTexts: [
        "el lienzo blanco no es un vacío, sino un campo de fuerza donde el error encuentra su lugar.",
        "ritmos visuales que nacen de la repetición y la sutil variación del fallo.",
        "una investigación sobre cómo la anomalía digital genera nuevas estéticas de diseño."
      ]
    },
    { 
      id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", 
      desc: "el contraste extremo define la forma.", 
      info: { date: "2022", location: "london", role: "creative lead" }, 
      gallery: customGallery,
      extraTexts: [
        "la luz y la sombra llevadas al límite para esculpir la identidad visual.",
        "un estudio sobre la legibilidad y la abstracción en entornos de alto contraste.",
        "reducción de la forma a su esencia lumínica y matérica."
      ]
    },
    { 
      id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", 
      desc: "abstracción aplicada al diseño contemporáneo.", 
      info: { date: "2023", location: "berlin", role: "photography" }, 
      gallery: customGallery,
      extraTexts: [
        "capturando la realidad a través de un filtro de abstracción geométrica.",
        "la fotografía como herramienta para descomponer y reensamblar el entorno urbano.",
        "una mirada que busca lo invisible en lo cotidiano a través del diseño visual."
      ]
    },
    { 
      id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", 
      desc: "fragmentos de un proceso inacabado.", 
      info: { date: "2024", location: "paris", role: "concept" }, 
      gallery: customGallery,
      extraTexts: [
        "la belleza de la evolución constante, capturada en un estado de 'work in progress'.",
        "una exploración conceptual sobre la ascendencia y la transformación formal.",
        "texturas visuales que narran la historia de su propia creación y error."
      ]
    },
    { 
      id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", 
      desc: "capturando la esencia del movimiento estático.", 
      info: { date: "2023", location: "barcelona", role: "production" }, 
      gallery: customGallery,
      extraTexts: [
        "una investigación visual sobre la tensión entre lo quieto y lo dinámico.",
        "el movimiento congelado en el tiempo para revelar patrones ocultos.",
        "una producción visual que explora la cinemática a través de la imagen fija."
      ]
    },
    { 
      id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", 
      desc: "reducción visual al mínimo exponente.", 
      info: { date: "2024", location: "remote", role: "ui design" }, 
      gallery: customGallery,
      extraTexts: [
        "la interfaz como un espacio de máxima limpieza y claridad visual.",
        "eliminación de lo superfluo para centrar la atención en la interacción pura.",
        "una estética de diseño que busca la máxima eficiencia visual con el mínimo de elementos."
      ]
    }
  ];

  // --- EFECTOS DE MOVIMIENTO ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // ... (Lógica de posiciones random para Home, Projects, About omitida para brevedad, mantenla igual)

    if (view === "detail") {
      // Posiciones de la info superior
      setDetailInfoPositions({
        date: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "18vw", rotate: (Math.random() * 8 - 4) + "deg" },
        location: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "11vw", rotate: (Math.random() * 8 - 4) + "deg" },
        role: { top: Math.floor(Math.random() * 5 + 3) + "vh", right: "4vw", rotate: (Math.random() * 8 - 4) + "deg" }
      });
      // Ya no generamos posiciones random para los textos de la izquierda
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
        {/* ... (Tu componente nav actual se mantiene igual) ... */}
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
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredIndex !== null ? `text-${hoveredIndex}` : 'title'}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {hoveredIndex !== null 
                ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") 
                : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ... (Home, Projects, About se mantienen igual) ... */}

        {/* VIEW: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            
            {/* Header info fija arriba (Random Positions) */}
            <div style={{ position: "fixed", width: "100vw", height: "15vh", top: 0, left: 0, zIndex: 1000, pointerEvents: "none" }}>
              <motion.div animate={{ ...detailInfoPositions.date }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>year </span>{selectedProject.info.date} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.location }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>loc </span>{selectedProject.info.location} </motion.div>
              <motion.div animate={{ ...detailInfoPositions.role }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.7rem" }}> <span style={{ opacity: 0.4 }}>role </span>{selectedProject.info.role} </motion.div>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              
              {/* COLUMNA IZQUIERDA: Info Fija Ordenada */}
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                
                {/* Bloque de Título y Descripción Principal */}
                <div style={{ marginBottom: "4rem" }}>
                  <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.8" }}>{selectedProject.title}</h1>
                  <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "1rem", maxWidth: "20vw", lineHeight: "1.4" }}>{selectedProject.desc}</p>
                </div>

                {/* LOS 3 PÁRRAFOS EXTRA (Ahora fijos y más grandes) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {selectedProject.extraTexts?.map((text, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                      style={{ 
                        fontFamily: fontBody, 
                        fontSize: "0.85rem", // NUEVO: Un poco más grande (era 0.65rem)
                        maxWidth: "18vw", // NUEVO: Un poco más ancho (era 10vw)
                        lineHeight: "1.6", 
                        opacity: 0.6 // NUEVO: Un poco más visible (era 0.4)
                      }}
                    >
                      {text}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* COLUMNA DERECHA: Galería Scrollable */}
              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div 
                    key={i} 
                    onMouseEnter={() => setHoveredIndex(i)} 
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-10%" }} 
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