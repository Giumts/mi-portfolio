"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// --- LOADER ---
const LoadingScreen = () => {
  const words = ["creative direction", "digital error", "visual harmony", "aria libera", "fragmentation", "beautiful failures", "loading...", "giulia studio"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 250);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed", inset: 0, backgroundColor: "white", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 10000,
      }}
    >
      <motion.p
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        style={{
          fontFamily: "'Monor', monospace", fontSize: "1.2rem",
          color: "#002FA7", textTransform: "lowercase",
        }}
      >
        {words[index]}
      </motion.p>
    </motion.div>
  );
};

// --- SOMBRA REACTIVA ---
const MouseShadowEffect = ({ mouseX, mouseY }) => {
  const scale = useTransform(
    [mouseX, mouseY],
    ([x, y]) => {
      if (typeof window === 'undefined') return 1;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      return 1 + (dist / maxDist) * 0.25;
    }
  );

  return (
    <motion.div
      style={{
        position: "fixed", left: "-50vw", top: "-50vh", x: mouseX, y: mouseY, 
        scale, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1,
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 47, 167, 0.2) 0%, rgba(0, 47, 167, 0.05) 40%, transparent 70%)`,
        filter: "blur(80px) saturate(150%)", mixBlendMode: "multiply", opacity: 0.8
      }}
    />
  );
};

export default function Home() {
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [cursorColor, setCursorColor] = useState("#000000");
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  const kleinBlue = "#002FA7"; 
  const fontTitle = "'Monor', monospace"; 
  const fontBody = "'Roundo', sans-serif";

  // Configuración de muelles para el cursor
  const springConfig = { stiffness: 300, damping: 30 };
  const mouseX = useSpring(0, springConfig); 
  const mouseY = useSpring(0, springConfig);

  // Datos de Proyectos (Refactorizado para limpieza)
  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, extraTexts: ["la fragmentación del tiempo", "error estético", "máquina e instinto"], gallery: [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, extraTexts: ["asimetría", "belleza efímera"], gallery: [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }] },
    // ... añade aquí el resto de tus proyectos siguiendo esta estructura
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg"];

  useEffect(() => {
    setHasMounted(true);
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: `${Math.random() * 60 + 15}vh`,
        left: `${Math.random() * 70 + 10}vw`,
        rotation: `${Math.random() * 10 - 5}deg`
      }));
      setProjectPositions(positions);
    }
  }, [view]);

  const getImageBrightness = (imgElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 10; canvas.height = 10;
    try {
      ctx.drawImage(imgElement, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      let r=0, g=0, b=0;
      for (let i=0; i<data.length; i+=4) { r+=data[i]; g+=data[i+1]; b+=data[i+2]; }
      const avg = (r+g+b) / (data.length / 4 * 3);
      setCursorColor(avg > 128 ? "#000000" : "#ffffff");
    } catch (e) { setCursorColor("#000000"); }
  };

  if (!hasMounted) return <div style={{backgroundColor: "white", height: "100vh"}} />;

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* NAVIGATION */}
            <nav style={{ position: "fixed", width: "100%", z.Index: 2000, pointerEvents: "none" }}>
              <div style={{ pointerEvents: "auto", fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase" }}>
                <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
                <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
                <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
              </div>
            </nav>

            {/* CUSTOM CURSOR FOR DETAIL */}
            {view === "detail" && selectedProject && (
              <motion.div style={{ 
                  position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999, 
                  padding: "15px", fontFamily: fontTitle, fontSize: "0.7rem", color: cursorColor, textTransform: "lowercase"
              }}>
                {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text) : selectedProject.title}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* HOME VIEW */}
              {view === "home" && (
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ImageTrail images={trailImages} />
                </motion.div>
              )}

              {/* PROJECTS VIEW */}
              {view === "projects" && (
                <motion.div key="projects" ref={containerRef} style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
                  <MouseShadowEffect mouseX={mouseX} mouseY={mouseY} />
                  <Crosshair containerRef={containerRef} color={kleinBlue} />
                  {projects.map((proj, i) => (
                    <motion.div 
                      key={proj.id} drag dragConstraints={containerRef}
                      onClick={() => { setSelectedProject(proj); setView("detail"); }}
                      style={{ position: "absolute", top: projectPositions[i]?.top, left: projectPositions[i]?.left, rotate: projectPositions[i]?.rotation, width: "180px", cursor: "pointer", zIndex: 10 }}>
                      <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)", transition: "filter 0.3s" }} onMouseEnter={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseLeave={e => e.currentTarget.style.filter="grayscale(100%)"} />
                      <p style={{ fontFamily: fontBody, marginTop: "8px", fontSize: "0.7rem" }}>{proj.title}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ABOUT VIEW */}
              {view === "about" && (
                <motion.div key="about" style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                   <p style={{ fontFamily: fontBody, fontSize: "1rem", maxWidth: "400px", textAlign: "center", lineHeight: "1.6" }}>
                    Directora creativa explorando la intersección entre el error digital y la armonía orgánica.
                  </p>
                </motion.div>
              )}

              {/* DETAIL VIEW */}
              {view === "detail" && selectedProject && (
                <motion.div key="detail" style={{ padding: "10vh 4vw" }}>
                  <div style={{ display: "flex", gap: "5vw" }}>
                    <div style={{ width: "30vw", position: "sticky", top: "10vh", height: "fit-content" }}>
                      <h1 style={{ fontFamily: fontTitle, fontSize: "4vw", color: kleinBlue, lineHeight: "0.9" }}>{selectedProject.title}</h1>
                      <p style={{ fontFamily: fontBody, marginTop: "2vh", opacity: 0.7 }}>{selectedProject.desc}</p>
                    </div>
                    <div style={{ width: "60vw", display: "flex", flexDirection: "column", gap: "15vh" }}>
                      {selectedProject.gallery.map((item, i) => (
                        <div key={i} onMouseEnter={(e) => { setHoveredIndex(i); getImageBrightness(e.currentTarget.querySelector("img, video")); }} onMouseLeave={() => setHoveredIndex(null)}>
                          {item.url.endsWith(".mp4") ? 
                            <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%" }} /> : 
                            <img src={item.url} style={{ width: "100%" }} />
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}