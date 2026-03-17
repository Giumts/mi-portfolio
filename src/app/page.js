"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [projectPositions, setProjectPositions] = useState([]);
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

  const [selectedProject, setSelectedProject] = useState(null);

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
        giulia: { top: "15vh", left: "40vw", rotate: "-2deg" },
        projects: { top: "75vh", left: "15vw", rotate: "4deg" },
        about: { top: "45vh", right: "12vw", rotate: "-3deg" }
      });
    }
    if (view === "about") {
      setAboutPositions({
        email: { top: "15vh", left: "10vw", rotate: "5deg" },
        phone: { bottom: "15vh", right: "10vw", rotate: "-8deg" }
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

        @media (max-width: 768px) {
          body, html, * { cursor: auto !important; }
        }
      `}</style>

      {/* NAVEGACIÓN GLOBAL */}
      <nav>
        <AnimatePresence>
          {view === "home" ? (
            <div className="nav-container-home">
              <motion.h1 onClick={() => setView("home")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.giulia }} className="nav-item-home title">giulia</motion.h1>
              <motion.div onClick={() => setView("projects")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.projects }} whileHover={{ color: kleinBlue }} className="nav-item-home">projects</motion.div>
              <motion.div onClick={() => setView("about")} initial={{ opacity: 0 }} animate={{ opacity: 1, ...navPositions.about }} whileHover={{ color: kleinBlue }} className="nav-item-home">about</motion.div>
            </div>
          ) : (
            <div style={{ fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase" }}>
              <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1000, cursor: "pointer", textDecoration: view === "home" ? "line-through" : "none" }}>giulia</div>
              <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
              <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
            </div>
          )}
        </AnimatePresence>

        <style jsx>{`
          .nav-item-home { position: fixed; font-family: ${fontTitle}; font-size: 0.8rem; z-index: 1000; cursor: pointer; }
          .title { font-size: 0.9rem; text-decoration: line-through; }
          
          @media (max-width: 768px) {
            .nav-container-home { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 20px; }
            .nav-item-home { position: relative !important; top: auto !important; left: auto !important; right: auto !important; transform: none !important; }
          }
        `}</style>
      </nav>

      <AnimatePresence mode="wait">
        {/* VIEW: HOME */}
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{height: "100vh"}}>
            <ImageTrail images={trailImages} />
          </motion.div>
        )}

        {/* VIEW: PROJECTS */}
        {view === "projects" && (
          <motion.div key="projects" ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="projects-view">
            <div className="hide-mobile">
               <Crosshair containerRef={containerRef} color={kleinBlue} />
            </div>
            {projects.map((proj, index) => (
              <motion.div key={proj.id} className="project-item" onClick={() => openProject(proj)} 
                style={{ 
                  position: "absolute", 
                  top: projectPositions[index]?.top, 
                  left: projectPositions[index]?.left, 
                  rotate: projectPositions[index]?.rotation,
                }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
            <style jsx>{`
              .projects-view { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
              .project-item { width: 150px; cursor: pointer; z-index: 10; }
              
              @media (max-width: 768px) {
                .projects-view { overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 100px 0; height: auto; min-height: 100vh; }
                .project-item { position: relative !important; top: auto !important; left: auto !important; rotate: 0deg !important; width: 80vw; margin-bottom: 40px; }
                .hide-mobile { display: none; }
              }
            `}</style>
          </motion.div>
        )}

        {/* VIEW: ABOUT */}
        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <div className="hide-mobile"><Crosshair color="#000" /></div>
            <motion.p animate={{ ...aboutPositions.email }} className="about-contact email">giulia@example.com</motion.p>
            <motion.p animate={{ ...aboutPositions.phone }} className="about-contact phone">+34 000 000 000</motion.p>
            <div className="about-content">
              <p>giulia es una directora creativa con base en barcelona, enfocada en la intersección entre el diseño digital y la imperfección orgánica.</p>
              <p>su trabajo explora el error como una herramienta estética, buscando la armonía en procesos inacabados y texturas visuales crudas.</p>
              <p>actualmente colabora con estudios internacionales desarrollando identidades visuales que desafían la limpieza digital convencional.</p>
            </div>
            <style jsx>{`
              .about-contact { position: absolute; font-family: ${fontTitle}; font-size: 0.8rem; color: ${kleinBlue}; z-index: 10; }
              .about-content { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; gap: 2rem; padding: 0 20vw; textAlign: center; z-index: 10; }
              .about-content p { font-family: ${fontBody}; font-size: 0.75rem; max-width: 300px; line-height: 1.5; text-align: center; }
              
              @media (max-width: 768px) {
                .about-contact { position: relative !important; top: auto !important; left: auto !important; bottom: auto !important; right: auto !important; text-align: center; margin: 10px 0; }
                .about-content { height: auto; padding: 100px 10vw; }
                .hide-mobile { display: none; }
                .email { order: 2; }
                .phone { order: 3; }
              }
            `}</style>
          </motion.div>
        )}

        {/* VIEW: DETAIL */}
        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <div className="hide-mobile"><Crosshair color={kleinBlue} /></div>
            
            <div className="detail-info-header">
              <div className="info-block"><span className="label">year</span><span>{selectedProject.info.date}</span></div>
              <div className="info-block"><span className="label">location</span><span>{selectedProject.info.location}</span></div>
              <div className="info-block"><span className="label">role</span><span>{selectedProject.info.role}</span></div>
            </div>

            <div className="detail-container">
              <div className="detail-sidebar">
                <h1 className="detail-title">{selectedProject.title}</h1>
                <p className="detail-desc">{selectedProject.desc}</p>
                <motion.div onClick={() => setView("projects")} whileHover={{ x: -5, color: kleinBlue }} className="back-btn">← back to projects</motion.div>
              </div>

              <div className="detail-gallery">
                {[selectedProject.img, ...selectedProject.gallery].map((img, i) => (
                  <motion.div key={i} className="gallery-img-wrapper" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                    <img src={img} style={{ width: "100%", height: "auto", display: "block" }} />
                  </motion.div>
                ))}
              </div>
            </div>

            <style jsx>{`
              .detail-info-header { position: fixed; top: 4vh; right: 4vw; font-family: ${fontTitle}; font-size: 0.7rem; color: ${kleinBlue}; z-index: 1000; display: flex; gap: 3rem; }
              .info-block { display: flex; flex-direction: column; }
              .label { opacity: 0.5; }
              .detail-container { display: flex; padding: 0 4vw; }
              .detail-sidebar { width: 35vw; height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; justify-content: center; padding-right: 4vw; }
              .detail-title { font-family: ${fontTitle}; font-size: 4.5vw; color: ${kleinBlue}; line-height: 0.9; margin-bottom: 2rem; }
              .detail-desc { font-family: ${fontBody}; font-size: 0.9rem; max-width: 24vw; line-height: 1.6; }
              .back-btn { margin-top: 3rem; font-family: ${fontTitle}; font-size: 0.7rem; cursor: pointer; }
              .detail-gallery { width: 65vw; padding: 25vh 0; display: flex; flex-direction: column; gap: 30vh; }
              .gallery-img-wrapper { width: 70%; }

              @media (max-width: 768px) {
                .detail-info-header { position: relative; top: auto; right: auto; padding: 80px 6vw 20px; gap: 1rem; justify-content: space-between; }
                .detail-container { flex-direction: column; padding: 0 6vw; }
                .detail-sidebar { width: 100%; height: auto; position: relative; padding-right: 0; margin-bottom: 50px; }
                .detail-title { font-size: 3rem; }
                .detail-desc { max-width: 100%; }
                .detail-gallery { width: 100%; padding: 0 0 100px; gap: 50px; }
                .gallery-img-wrapper { width: 100% !important; }
                .hide-mobile { display: none; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}