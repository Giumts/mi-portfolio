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

  // --- BASE DE DATOS DE PROYECTOS ---
  // He asegurado que todos tengan 10 imágenes en 'gallery'
  const projects = [
    { 
      id: 1, 
      title: "24 seconds", 
      img: "/fotos_portadas/Portada_24seconds.jpg", 
      desc: "una búsqueda de la armonía en el error digital.", 
      info: { date: "2024", location: "barcelona", role: "creative direction" },
      gallery: [
        { src: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "instante 01" },
        { src: "/BEAUTIFUL_FAILURES_AY3.jpg", text: "instante 02" },
        { src: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "instante 03" },
        { src: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "instante 04" },
        { src: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "instante 05" },
        { src: "/BEAUTIFUL_FAILURES_AY49.jpg", text: "instante 06" },
        { src: "/BEAUTIFUL_FAILURES_AY51.jpg", text: "instante 07" },
        { src: "/BEAUTIFUL_FAILURES_AY59.jpg", text: "instante 08" },
        { src: "/BEAUTIFUL_FAILURES_AY71.jpg", text: "instante 09" },
        { src: "/BEAUTIFUL_FAILURES_AY75.jpg", text: "instante 10" }
      ]
    },
    { 
      id: 2, 
      title: "beautiful failures", 
      img: "/fotos_portadas/Portada_Beautiful failures.jpg", 
      desc: "exploración rítmica del espacio y el error controlado.", 
      info: { date: "2024", location: "madrid", role: "visual design" },
      gallery: [
        { src: "/BEAUTIFUL_FAILURES_AY49.jpg", text: "caos 01" },
        { src: "/BEAUTIFUL_FAILURES_AY51.jpg", text: "caos 02" },
        { src: "/BEAUTIFUL_FAILURES_AY59.jpg", text: "caos 03" },
        { src: "/BEAUTIFUL_FAILURES_AY71.jpg", text: "caos 04" },
        { src: "/BEAUTIFUL_FAILURES_AY1.jpg", text: "caos 05" },
        { src: "/BEAUTIFUL_FAILURES_AY15.jpg", text: "caos 06" },
        { src: "/BEAUTIFUL_FAILURES_AY37.jpg", text: "caos 07" },
        { src: "/BEAUTIFUL_FAILURES_AY75.jpg", text: "caos 08" },
        { src: "/BEAUTIFUL_FAILURES_AY42.jpg", text: "caos 09" },
        { src: "/BEAUTIFUL_FAILURES_AY9.jpg", text: "caos 10" }
      ]
    },
    { id: 3, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", desc: "luz y geometría.", info: { date: "2022", location: "london", role: "creative lead" }, gallery: Array(10).fill({ src: "/BEAUTIFUL_FAILURES_AY71.jpg", text: "geometría" }) },
    { id: 4, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", desc: "reducción al mínimo.", info: { date: "2024", location: "remote", role: "ui design" }, gallery: Array(10).fill({ src: "/BEAUTIFUL_FAILURES_AY51.jpg", text: "límite" }) }
  ];

  // Rastro de la home: Solo de Beautiful Failures
  const bfImages = projects.find(p => p.title === "beautiful failures")?.gallery.map(g => g.src) || [];

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

      {/* CURSOR INTERACTIVO */}
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

      {/* NAVEGACIÓN */}
      <nav style={{ position: "fixed", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1000 }}>
        <div onClick={() => setView("home")} style={{ position: "absolute", top: view === "home" ? "5vh" : "4vh", left: view === "home" ? "50%" : "4vw", transform: view === "home" ? "translateX(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "home" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease", cursor: "pointer" }}>giulia</div>
        <div onClick={() => {setView("projects"); setSelectedProject(null)}} style={{ position: "absolute", bottom: view === "home" ? "5vh" : "4vh", left: view === "home" ? "50%" : "4vw", transform: view === "home" ? "translateX(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "projects" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease", cursor: "pointer" }}>projects</div>
        <div onClick={() => {setView("about"); setSelectedProject(null)}} style={{ position: "absolute", right: view === "home" ? "8vw" : "4vw", top: view === "home" ? "50%" : "auto", bottom: view === "home" ? "auto" : "4vh", transform: view === "home" ? "translateY(-50%)" : "none", fontFamily: view === "home" ? fontTitle : fontBody, color: view === "home" ? kleinBlue : "#000", fontSize: view === "home" ? "1.1rem" : "0.8rem", textDecoration: view === "about" ? "line-through" : "none", pointerEvents: "auto", transition: "all 0.5s ease", cursor: "pointer" }}>about</div>
      </nav>

      {/* CONTENIDO */}
      <div style={{ width: "100vw", minHeight: "100vh" }}>
        {view === "home" && <ImageTrail images={bfImages} />}

        <AnimatePresence mode="wait">
          {/* GRID DE PROYECTOS */}
          {view === "projects" && (
            <motion.div key="projects-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh" }}>
              {projects.map((proj, index) => (
                <motion.div 
                  key={`proj-${proj.id}`} 
                  onClick={() => {setSelectedProject(proj); setView("detail")}} 
                  style={{ position: "absolute", top: randomPositions[index]?.top || "20vh", left: randomPositions[index]?.left || "20vw", rotate: randomPositions[index]?.rotation || "0deg", width: "180px", cursor: "pointer" }}
                >
                  <img src={proj.img} style={{ width: "100%", height: "auto", display: "block", filter: "grayscale(100%)" }} onMouseOver={e => e.target.style.filter="none"} onMouseOut={e => e.target.style.filter="grayscale(100%)"} />
                  <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem", color: "#000" }}>{proj.title}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* VISTA DE DETALLE */}
          {view === "detail" && selectedProject && (
            <motion.div key={`detail-${selectedProject.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ position: "fixed", top: "4vh", right: "4vw", fontFamily: fontTitle, color: kleinBlue, fontSize: "0.85rem", display: "flex", gap: "3rem", zIndex: 1000 }}>
                <span>{selectedProject.info.date}</span><span>{selectedProject.info.location}</span><span>{selectedProject.info.role}</span>
              </div>
              
              <div style={{ display: "flex", padding: "0 4vw" }}>
                <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h1 style={{ fontFamily: fontTitle, fontSize: "5vw", color: kleinBlue, lineHeight: "1", textTransform: "lowercase" }}>{selectedProject.title}</h1>
                  <p style={{ fontFamily: fontBody, fontSize: "1.1rem", maxWidth: "24vw", marginTop: "2rem" }}>{selectedProject.desc}</p>
                </div>
                
                <div style={{ width: "65vw", paddingTop: "25vh", display: "flex", flexDirection: "column", gap: "35vh", paddingBottom: "20vh" }}>
                  {selectedProject.gallery.map((item, i) => (
                    <motion.div 
                      key={`img-${i}`} 
                      style={{ 
                        width: (i + 1) % 3 === 0 ? "85vw" : "40vw", 
                        alignSelf: (i % 2 === 0 ? "flex-end" : "flex-start"), 
                        marginLeft: (i + 1) % 3 === 0 ? "-30vw" : "0" 
                      }}
                    >
                      <img 
                        src={item.src} 
                        onMouseEnter={() => setHoverData({ active: true, title: selectedProject.title, text: item.text })} 
                        onMouseLeave={() => setHoverData({ active: false, title: "", text: "" })} 
                        style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* VISTA ABOUT */}
          {view === "about" && (
            <motion.div key="about-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative" }}>
              <div style={{ position: "absolute", top: "4vh", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4rem" }}>
                <span style={{ fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giulia@studio.com</span>
                <span style={{ fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+34 600 000 000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "100%", paddingRight: "10vw" }}>
                <p style={{ fontFamily: fontBody, fontSize: "1rem", color: "#000", maxWidth: "30vw", lineHeight: "1.6" }}>
                  giulia es una directora creativa enfocada en la estética de la imperfección y la narrativa visual contemporánea...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}