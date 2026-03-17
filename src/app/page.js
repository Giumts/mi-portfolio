"use client";
import { useState, useEffect } from "react";
import ImageTrail from "./ImageTrail";
import { motion, AnimatePresence, useSpring } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("home");
  const [randomPositions, setRandomPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoverData, setHoverData] = useState({ active: false, title: "", text: "" });

  const springConfig = { stiffness: 250, damping: 25 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const kleinBlue = "#002FA7";
  const fontTitle = "'Lineal Thin', sans-serif";
  const fontBody = "'Roundo Extra Light', sans-serif";

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24seconds.jpg", desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "instante suspendido" }, { src: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "ruido visual" }] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", desc: "la imperfección como lenguaje visual.", info: { date: "2023", location: "milan", role: "art direction" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "aire contenido" }] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", desc: "exploración rítmica del espacio.", info: { date: "2024", location: "madrid", role: "visual design" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY49.jpg", text: "caos ordenado" }] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "contraste extremo.", info: { date: "2022", location: "london", role: "creative lead" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY71.jpg", text: "geometría" }] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", desc: "abstracción aplicada.", info: { date: "2023", location: "berlin", role: "photography" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY9.jpg", text: "fragmento" }] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", desc: "procesos inacabados.", info: { date: "2024", location: "paris", role: "concept" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "estética" }] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", desc: "movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "raíces" }] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción visual.", info: { date: "2024", location: "remote", role: "ui design" }, gallery: [{ src: "/BEAUTIFUL_FAILURES_AY51.jpg", text: "límite" }] }
  ];

  const trailImages = projects.map(p => p.img);

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
      setRandomPositions(positions);
    }
  }, [view]);

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      
      <style jsx global>{`
        @font-face { font-family: 'Lineal Thin'; src: url('/fonts/Lineal-Thin.otf') format('opentype'); }
        @font-face { font-family: 'Roundo Extra Light'; src: url('/fonts/Roundo-ExtraLight.otf') format('opentype'); }
        body, html, * { cursor: crosshair !important; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* CURSOR (Solo en detalle) */}
      <AnimatePresence>
        {hoverData.active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", x: mouseX, y: mouseY, marginLeft: "20px", marginTop: "20px", zIndex: 9999, pointerEvents: "none", display: "flex", flexDirection: "column" }}
          >
            <span style={{ fontFamily: fontTitle, fontSize: "2.5rem", color: kleinBlue, textTransform: "lowercase", lineHeight: "0.9" }}>{hoverData.title}</span>
            <span style={{ fontFamily: fontBody, fontSize: "0.9rem", color: "#000", textTransform: "lowercase", marginTop: "5px" }}>{hoverData.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVEGACIÓN FIJA (Sin desvanecimientos extraños) */}
      <nav style={{ position: "fixed", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1000 }}>
        {/* GIULIA */}
        <div 
          onClick={() => setView("home")} 
          style={{ position: "absolute", top: view === "home" ? "5vh" : "4vh", left: view === "home" ? "50%" : "4vw", transform: view === "home" ? "translateX(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "home" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease" }}
        >giulia</div>

        {/* PROJECTS */}
        <div 
          onClick={() => {setView("projects"); setSelectedProject(null)}} 
          style={{ position: "absolute", bottom: view === "home" ? "5vh" : "4vh", left: view === "home" ? "50%" : "4vw", transform: view === "home" ? "translateX(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "projects" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease" }}
        >projects</div>

        {/* ABOUT */}
        <div 
          onClick={() => {setView("about"); setSelectedProject(null)}} 
          style={{ position: "absolute", right: view === "home" ? "8vw" : "4vw", top: view === "home" ? "50%" : "auto", bottom: view === "home" ? "auto" : "4vh", transform: view === "home" ? "translateY(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "about" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease" }}
        >about</div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ width: "100vw", height: "100vh" }}>
        {view === "home" && <ImageTrail images={trailImages} />}

        <AnimatePresence mode="wait">
          {view === "projects" && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh" }}>
              {projects.map((proj, index) => (
                <motion.div key={proj.id} onClick={() => {setSelectedProject(proj); setView("detail")}} style={{ position: "absolute", top: randomPositions[index]?.top, left: randomPositions[index]?.left, rotate: randomPositions[index]?.rotation, width: "150px", cursor: "pointer" }}>
                  <img src={proj.img} style={{ width: "100%", filter: "grayscale(100%)" }} />
                  <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem", color: "#000" }}>{proj.title}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {view === "detail" && selectedProject && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ position: "fixed", top: "4vh", right: "4vw", fontFamily: fontTitle, color: kleinBlue, fontSize: "0.85rem", display: "flex", gap: "3rem", zIndex: 1000 }}>
                <span>{selectedProject.info.date}</span><span>{selectedProject.info.location}</span><span>{selectedProject.info.role}</span>
              </div>
              <div style={{ display: "flex", padding: "0 4vw" }}>
                <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h1 style={{ fontFamily: fontTitle, fontSize: "5vw", color: kleinBlue, lineHeight: "1" }}>{selectedProject.title}</h1>
                  <p style={{ fontFamily: fontBody, fontSize: "1.1rem", maxWidth: "24vw", marginTop: "2rem" }}>{selectedProject.desc}</p>
                </div>
                <div style={{ width: "65vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "35vh", paddingBottom: "10vh" }}>
                  {selectedProject.gallery.map((item, i) => (
                    <motion.div key={i} style={{ width: (i + 1) % 3 === 0 ? "85vw" : "40vw", alignSelf: (i % 2 === 0 ? "flex-end" : "flex-start"), marginLeft: (i + 1) % 3 === 0 ? "-30vw" : "0" }}>
                      <img src={item.src} onMouseEnter={() => setHoverData({ active: true, title: selectedProject.title, text: item.text })} onMouseLeave={() => setHoverData({ active: false, title: "", text: "" })} style={{ width: "100%", height: (i + 1) % 3 === 0 ? "85vh" : "auto", objectFit: "cover" }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === "about" && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
              <div style={{ position: "absolute", top: "4vh", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4rem" }}>
                <span style={{ fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giulia@studio.com</span>
                <span style={{ fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+34 600 000 000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "100%", paddingRight: "10vw" }}>
                <p style={{ fontFamily: fontBody, fontSize: "1rem", color: "#000", maxWidth: "30vw", lineHeight: "1.6" }}>giulia es una directora creativa enfocada en la estética de la imperfección y la narrativa visual contemporánea...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}