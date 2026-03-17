"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [projectPositions, setProjectPositions] = useState([]);
  const [navPositions, setNavPositions] = useState({
    giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
    projects: { top: "75vh", left: "15vw", rotate: "4deg" },
    about: { top: "45vh", right: "12vw", rotate: "-3deg" }
  });
  
  const [aboutPositions, setAboutPositions] = useState({
    email: { top: "20vh", left: "15vw", rotate: "5deg" },
    phone: { bottom: "15vh", right: "20vw", rotate: "-8deg" }
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

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
        giulia: { top: Math.floor(Math.random() * 20 + 10) + "vh", left: Math.floor(Math.random() * 50 + 20) + "vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" },
        projects: { top: Math.floor(Math.random() * 20 + 65) + "vh", left: Math.floor(Math.random() * 30 + 5) + "vw", rotate: Math.floor(Math.random() * 14 - 7) + "deg" },
        about: { top: Math.floor(Math.random() * 30 + 35) + "vh", right: Math.floor(Math.random() * 15 + 5) + "vw", rotate: Math.floor(Math.random() * 10 - 5) + "deg" }
      });
    }
    if (view === "about") {
      setAboutPositions({
        email: { top: Math.floor(Math.random() * 20 + 5) + "vh", left: Math.floor(Math.random() * 60 + 5) + "vw", rotate: Math.floor(Math.random() * 20 - 10) + "deg" },
        phone: { bottom: Math.floor(Math.random() * 20 + 5) + "vh", right: Math.floor(Math.random() * 60 + 5) + "vw", rotate: Math.floor(Math.random() * 20 - 10) + "deg" }
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
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * { 
          margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased;
          cursor: crosshair !important;
        }
        body:active, html:active, *:active {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);transform-origin: center;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>') 12 12, crosshair !important;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NAVEGACIÓN ACTUALIZADA */}
      <nav>
        <AnimatePresence>
          {view === "home" ? (
            <>
              <motion.h1 onClick={() => setView("home")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.giulia }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.9rem", textDecoration: "line-through", zIndex: 1000, cursor: "pointer" }}>giulia</motion.h1>
              <motion.div onClick={() => setView("projects")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.projects }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>projects</motion.div>
              <motion.div onClick={() => setView("about")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.about }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>about</motion.div>
            </>
          ) : (
            /* Navegación para About, Projects y Detail */
            <div style={{ 
              fontFamily: (view === "about" || view === "projects" ? fontTitle : fontBody), 
              fontSize: "0.8rem", 
              textTransform: "lowercase" 
            }}>
              <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
              <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
              <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh" }}>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} onClick={() => openProject(proj)} style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: "150px", cursor: "pointer" }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <svg style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
               <motion.circle cx={mouseX} cy={mouseY} r="40" stroke={kleinBlue} strokeWidth="0.5" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} />
               <motion.line x1="50%" y1="50%" x2={mouseX} y2={mouseY} stroke={kleinBlue} strokeWidth="0.5" strokeDasharray="5,5" initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} />
            </svg>
            <motion.p animate={{ ...aboutPositions.email }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue, zIndex: 10 }}>giulia@example.com</motion.p>
            <motion.p animate={{ ...aboutPositions.phone }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue, zIndex: 10 }}>+34 000 000 000</motion.p>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: "2rem", padding: "0 20vw", textAlign: "center", zIndex: 10 }}>
              <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "300px", lineHeight: "1.5" }}>giulia es una directora creativa con base en barcelona, enfocada en la intersección entre el diseño digital y la imperfección orgánica.</p>
              <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "300px", lineHeight: "1.5" }}>su trabajo explora el error como una herramienta estética, buscando la armonía en procesos inacabados y texturas visuales crudas.</p>
              <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "300px", lineHeight: "1.5" }}>actualmente colabora con estudios internacionales desarrollando identidades visuales que desafían la limpieza digital convencional.</p>
            </div>
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div style={{ position: "fixed", top: "4vh", right: "4vw", fontFamily: fontTitle, fontSize: "0.9rem", color: kleinBlue, zIndex: 1000, display: "flex", gap: "3rem" }}>
              <span>{selectedProject.info.date}</span>
              <span>{selectedProject.info.location}</span>
              <span>{selectedProject.info.role}</span>
            </div>
            <div style={{ display: "flex", padding: "0 4vw" }}>
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h1 style={{ fontFamily: fontTitle, fontSize: "5vw", color: kleinBlue, lineHeight: "0.9", marginBottom: "2rem" }}>{selectedProject.title}</h1>
                <p style={{ fontFamily: fontBody, fontSize: "1.1rem", maxWidth: "24vw", lineHeight: "1.4" }}>{selectedProject.desc}</p>
              </div>
              <div style={{ width: "65vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "35vh" }}>
                {[selectedProject.img, ...selectedProject.gallery].map((img, i) => (
                  <motion.img key={i} src={img} style={{ width: (i + 1) % 3 === 0 ? "80%" : "50%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start", objectFit: "cover" }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}