const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// --- COMPONENTE LOADER ---
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

// --- COMPONENTE DE SOMBRA REACTIVA ---
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
        scale: scale, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1,
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 47, 167, 0.25) 0%, transparent 70%)`,
        filter: "blur(80px)", mixBlendMode: "multiply", opacity: 0.8
      }}
    />
  );
};

export default function Home() {
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [cursorColor, setCursorColor] = useState("#000000");
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  // --- CONFIGURACIÓN DE ESTILO ---
  const kleinBlue = "#002FA7"; 
  const fontTitle = "'Monor', monospace"; 
  const fontBody = "'Roundo', sans-serif";
  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig); 
  const mouseY = useSpring(0, springConfig);

  // --- TUS GALERÍAS ---
  const gallery1 = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }, { url: "/fotos_detalle/24_6.jpg", text: "frame 06" }, { url: "/fotos_detalle/24_7.jpg", text: "frame 07" }, { url: "/fotos_detalle/24_8.jpg", text: "frame 08" }];
  const gallery2 = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }];
  const gallery3 = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.png", text: "After studying..." }, { url: "/fotos_detalle/bf_6.png", text: "fail 06" }, { url: "/fotos_detalle/bf_7.png", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const gallery4 = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }];
  const gallery5 = [{ url: "/fotos_detalle/moria_1.jpg", text: "moria 01" }, { url: "/fotos_detalle/moria_2.jpg", text: "moria 02" }];
  const gallery6 = [{ url: "/fotos_detalle/rise_1.jpg", text: "rise 01" }, { url: "/fotos_detalle/rise_2.jpg", text: "rise 02" }];
  const gallery7 = [{ url: "/fotos_detalle/sad_1.jpg", text: "san 01" }, { url: "/fotos_detalle/sad_2.jpg", text: "san 02" }];
  const gallery8 = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", gallery: gallery1, desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" } },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", gallery: gallery2, desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" } },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", gallery: gallery3, desc: "exploración rítmica del espacio en blanco.", info: { date: "2024", location: "madrid", role: "visual design" } },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", gallery: gallery4, desc: "el contraste extremo define la forma.", info: { date: "2022", location: "london", role: "creative lead" } },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", gallery: gallery5, desc: "abstracción aplicada al diseño contemporáneo.", info: { date: "2023", location: "berlin", role: "photography" } },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", gallery: gallery6, desc: "fragmentos de un proceso inacabado.", info: { date: "2024", location: "paris", role: "concept" } },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", gallery: gallery7, desc: "capturando la esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" } },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", gallery: gallery8, desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" } }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];

  // --- EFECTOS ---
  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setTimeout(() => setIsLoading(false), 2500);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (view === "projects" && !isMobile) {
      setProjectPositions(projects.map(() => ({
        top: Math.random() * 60 + 15 + "vh",
        left: Math.random() * 70 + 10 + "vw",
        rotation: (Math.random() * 10 - 5) + "deg"
      })));
    }
  }, [view, isMobile]);

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

  if (!hasMounted) return null;

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <AnimatePresence mode="wait">
        {isLoading ? <LoadingScreen key="loader" /> : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* NAVIGATION */}
            <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 2000, pointerEvents: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: isMobile ? "3vh 6vw" : "4vh 4vw", pointerEvents: "auto", fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase" }}>
                <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
                <div style={{ display: "flex", gap: isMobile ? "1rem" : "2rem" }}>
                  <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
                  <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
                </div>
              </div>
            </nav>

            {/* CURSOR DETALLE (Sólo Desktop) */}
            {!isMobile && view === "detail" && selectedProject && (
              <motion.div style={{ 
                  position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999, 
                  padding: "12px", fontFamily: fontTitle, fontSize: "0.6rem", color: cursorColor,
                  textTransform: "lowercase", display: "flex", flexDirection: "column" 
              }}>
                {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") : selectedProject.title}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {view === "home" && (
                <motion.div key="home">
                  <ImageTrail images={trailImages} />
                </motion.div>
              )}

              {view === "projects" && (
                <motion.div 
                  key="projects" 
                  ref={containerRef} 
                  style={{ 
                    width: "100vw", 
                    minHeight: "100vh", 
                    position: "relative", 
                    overflowY: isMobile ? "auto" : "hidden",
                    padding: isMobile ? "15vh 6vw" : "0"
                  }}
                >
                  {!isMobile && <MouseShadowEffect mouseX={mouseX} mouseY={mouseY} />}
                  {!isMobile && <Crosshair color={kleinBlue} />}
                  
                  <div style={isMobile ? { display: "flex", flexDirection: "column", gap: "6vh" } : {}}>
                    {projects.map((proj, i) => (
                      <motion.div 
                        key={proj.id} 
                        drag={!isMobile} 
                        dragConstraints={containerRef}
                        onClick={() => { setSelectedProject(proj); setView("detail"); window.scrollTo(0,0); }}
                        style={isMobile ? { width: "100%", cursor: "pointer" } : {
                          position: "absolute", top: projectPositions[i]?.top, left: projectPositions[i]?.left, rotate: projectPositions[i]?.rotation, width: "160px", cursor: "pointer", zIndex: 10 
                        }}>
                        <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: isMobile ? "none" : "grayscale(100%)", transition: "filter 0.3s" }} onMouseEnter={e => !isMobile && (e.currentTarget.style.filter="grayscale(0%)")} onMouseLeave={e => !isMobile && (e.currentTarget.style.filter="grayscale(100%)")} />
                        <p style={{ fontFamily: fontBody, marginTop: "8px", fontSize: isMobile ? "0.9rem" : "0.7rem" }}>{proj.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {view === "about" && (
                <motion.div key="about" style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 10vw" }}>
                   <p style={{ fontFamily: fontBody, fontSize: isMobile ? "1.1rem" : "1.2rem", textAlign: "center", lineHeight: "1.6", maxWidth: "500px" }}>
                    Directora creativa explorando la intersección entre el error digital y la armonía orgánica.
                  </p>
                  <div style={{ marginTop: "4vh", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>
                    giulia@studio.com
                  </div>
                </motion.div>
              )}

              {view === "detail" && selectedProject && (
                <motion.div key="detail" style={{ minHeight: "100vh", backgroundColor: "white" }}>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    padding: isMobile ? "12vh 6vw" : "15vh 4vw" 
                  }}>
                    {/* INFO COLUMN */}
                    <div style={{ 
                      width: isMobile ? "100%" : "35vw", 
                      height: isMobile ? "auto" : "70vh", 
                      position: isMobile ? "relative" : "sticky", 
                      top: isMobile ? "0" : "15vh",
                      marginBottom: isMobile ? "8vh" : "0"
                    }}>
                      <h1 style={{ fontFamily: fontTitle, fontSize: isMobile ? "12vw" : "4.5vw", color: kleinBlue, lineHeight: "0.8", textTransform: "lowercase" }}>{selectedProject.title}</h1>
                      <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "2rem", maxWidth: isMobile ? "100%" : "20vw", opacity: 0.8 }}>{selectedProject.desc}</p>
                      <div style={{ marginTop: "4vh", fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase", color: kleinBlue }}>
                        <p>{selectedProject.info.role} / {selectedProject.info.location} / {selectedProject.info.date}</p>
                      </div>
                    </div>

                    {/* GALLERY COLUMN */}
                    <div style={{ 
                      width: isMobile ? "100%" : "65vw", 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: isMobile ? "6vh" : "25vh", 
                      paddingBottom: "20vh" 
                    }}>
                      {selectedProject.gallery.map((item, i) => (
                        <div 
                          key={i} 
                          onMouseEnter={(e) => { !isMobile && setHoveredIndex(i); !isMobile && getImageBrightness(e.currentTarget.querySelector("img, video")); }} 
                          onMouseLeave={() => setHoveredIndex(null)}
                          style={isMobile ? { width: "100%" } : { width: i % 2 === 0 ? "80%" : "100%", alignSelf: i % 2 === 0 ? "flex-start" : "flex-end" }}
                        >
                          {item.url.endsWith(".mp4") ? (
                            <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%" }} />
                          ) : (
                            <img src={item.url} style={{ width: "100%" }} />
                          )}
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