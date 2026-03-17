"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useSpring } from "framer-motion";

const ImageTrail = dynamic(() => import("./ImageTrail"), { ssr: false });
const Crosshair = dynamic(() => import("./Crosshair"), { ssr: false });

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

  const trailImages = [
    "/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", 
    "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", 
    "/BEAUTIFUL_FAILURES_AY42.jpg", "/BEAUTIFUL_FAILURES_AY49.jpg", 
    "/BEAUTIFUL_FAILURES_AY51.jpg", "/BEAUTIFUL_FAILURES_AY59.jpg", 
    "/BEAUTIFUL_FAILURES_AY71.jpg", "/BEAUTIFUL_FAILURES_AY75.jpg", 
    "/BEAUTIFUL_FAILURES_AY9.jpg"
  ];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24seconds.jpg", desc: "una búsqueda de la armonía en el error digital.", gallery: trailImages },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual.", gallery: trailImages },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio.", gallery: trailImages },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "el contraste extremo define la forma.", gallery: trailImages },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada al diseño.", gallery: trailImages },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "fragmentos de un proceso inacabado.", gallery: trailImages },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "capturando la esencia del movimiento.", gallery: trailImages },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción visual al mínimo.", gallery: trailImages },
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
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 60 + 15) + "vh",
        left: Math.floor(Math.random() * 70 + 10) + "vw",
        rotation: Math.floor(Math.random() * 10 - 5) + "deg",
      }));
      setProjectPositions(positions);
    }
  }, [view]);

  return (
    <main className="main-container">
      <style jsx global>{`
        body, html, * { 
          margin: 0; padding: 0; color: #000; font-family: serif;
          -webkit-font-smoothing: antialiased;
        }
        .main-container { background-color: white; min-height: 100vh; width: 100vw; position: relative; overflow-x: hidden; }
        
        /* Nav Home */
        .nav-item-home { position: fixed; font-size: 0.8rem; z-index: 1000; cursor: pointer; text-transform: lowercase; }
        .title-home { font-size: 0.9rem; text-decoration: line-through; }
        
        /* Nav Global (Compact) */
        .nav-fixed { font-size: 0.8rem; text-transform: lowercase; }
        .nav-link { position: fixed; z-index: 1000; cursor: pointer; }
        
        /* Views */
        .projects-view { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
        .project-item { width: 150px; cursor: pointer; z-index: 10; position: absolute; }
        .about-content { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; padding: 0 20vw; text-align: center; }
        
        /* Detail View */
        .detail-container { display: flex; padding: 0 4vw; }
        .detail-sidebar { width: 35vw; height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; justify-content: center; }
        .detail-gallery { width: 65vw; padding: 25vh 0; display: flex; flex-direction: column; gap: 30vh; }
        
        /* Responsividad */
        @media (max-width: 768px) {
          .nav-container-home { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 20px; }
          .nav-item-home { position: relative !important; top: auto !important; left: auto !important; transform: none !important; }
          .projects-view { overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 100px 0; height: auto; }
          .project-item { position: relative !important; top: auto !important; left: auto !important; rotate: 0deg !important; width: 80vw; margin-bottom: 40px; }
          .detail-container { flex-direction: column; padding: 80px 6vw; }
          .detail-sidebar { width: 100%; height: auto; position: relative; }
          .detail-gallery { width: 100%; gap: 50px; }
          .hide-mobile { display: none; }
        }
      `}</style>

      {/* Navegación */}
      <nav>
        {view === "home" ? (
          <div className="nav-container-home">
            <motion.h1 onClick={() => setView("home")} animate={navPositions.giulia} className="nav-item-home title-home">giulia</motion.h1>
            <motion.div onClick={() => setView("projects")} animate={navPositions.projects} className="nav-item-home">projects</motion.div>
            <motion.div onClick={() => setView("about")} animate={navPositions.about} className="nav-item-home">about</motion.div>
          </div>
        ) : (
          <div className="nav-fixed">
            <div onClick={() => setView("home")} className="nav-link" style={{ top: "20px", left: "20px", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
            <div onClick={() => setView("projects")} className="nav-link" style={{ bottom: "20px", left: "20px", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
            <div onClick={() => setView("about")} className="nav-link" style={{ bottom: "20px", right: "20px", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
          </div>
        )}
      </nav>

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="projects-view">
            <div className="hide-mobile"><Crosshair containerRef={containerRef} color="#002FA7" /></div>
            {projects.map((proj, index) => (
              <div key={proj.id} className="project-item" onClick={() => { setSelectedProject(proj); setView("detail"); }} 
                style={{ 
                  top: projectPositions[index]?.top || "20vh", 
                  left: projectPositions[index]?.left || "20vw", 
                  rotate: projectPositions[index]?.rotation || "0deg" 
                }}>
                <img src={proj.img} style={{ width: "100%", filter: "grayscale(100%)" }} alt={proj.title} />
                <p style={{ fontSize: "0.7rem", marginTop: "5px" }}>{proj.title}</p>
              </div>
            ))}
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="about-content">
              <p>giulia es una directora creativa con base en barcelona...</p>
              <p style={{ color: "#002FA7", marginTop: "20px" }}>giulia@studio.com</p>
            </div>
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="detail-container">
              <div className="detail-sidebar">
                <h1 style={{ fontSize: "4vw", color: "#002FA7" }}>{selectedProject.title}</h1>
                <p>{selectedProject.desc}</p>
                <p onClick={() => setView("projects")} style={{ cursor: "pointer", marginTop: "20px" }}>← back</p>
              </div>
              <div className="detail-gallery">
                <img src={selectedProject.img} style={{ width: "100%" }} />
                {selectedProject.gallery.map((img, i) => (
                   <img key={i} src={img} style={{ width: "80%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}