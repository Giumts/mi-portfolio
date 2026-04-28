"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring } from "framer-motion";
import UnicornScene from "unicornstudio-react";

export default function Home() {
  const [view, setView] = useState("home");
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [detailInfoPositions, setDetailInfoPositions] = useState({});
  const [cursorColor, setCursorColor] = useState("#000000");
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  const kleinBlue = "#002FA7"; 
  const fontTitle = "'Monor', monospace"; 
  const fontBody = "'Roundo', sans-serif";

  // --- CONFIGURACIÓN DE GALERÍAS ---
  const gallery1 = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }, { url: "/fotos_detalle/24_6.jpg", text: "frame 06" }, { url: "/fotos_detalle/24_7.jpg", text: "frame 07" }, { url: "/fotos_detalle/24_8.jpg", text: "frame 08" }];
  const gallery2 = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_9.jpg", text: "vuelo 09" }, { url: "/fotos_detalle/aria_10.jpg", text: "vuelo 10" }, { url: "/fotos_detalle/aria_11.jpg", text: "vuelo 11" }, { url: "/fotos_detalle/aria_12.jpg", text: "vuelo 12" }];
  const gallery3 = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.png", text: "After studying the imperfections that time left on the ground..." }, { url: "/fotos_detalle/bf_6.png", text: "fail 06" }, { url: "/fotos_detalle/bf_7.png", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const gallery4 = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }, { url: "/fotos_detalle/led_5.jpg", text: "light 05" }, { url: "/fotos_detalle/led_6.png", text: "light 06" }, { url: "/fotos_detalle/led_7.jpg", text: "light 07" }, { url: "/fotos_detalle/led_8.jpg", text: "light 08" }, { url: "/fotos_detalle/led_9.jpg", text: "light 09" }, { url: "/fotos_detalle/led_10.png", text: "light 10" }, { url: "/fotos_detalle/led_11.png", text: "light 11" }, { url: "/fotos_detalle/led_12.png", text: "light 12" }, { url: "/fotos_detalle/led_13.png", text: "light 13" }];
  const gallery5 = [{ url: "/fotos_detalle/moria_1.jpg", text: "moria 01" }, { url: "/fotos_detalle/moria_2.jpg", text: "moria 02" }, { url: "/fotos_detalle/moria_3.jpg", text: "moria 03" }, { url: "/fotos_detalle/moria_4.jpg", text: "moria 04" }, { url: "/fotos_detalle/moria_5.jpg", text: "moria 05" }, { url: "/fotos_detalle/moria_6.jpg", text: "moria 06" }, { url: "/fotos_detalle/moria_7.jpg", text: "moria 07" }, { url: "/fotos_detalle/moria_8.jpg", text: "moria 08" }];
  const gallery6 = [{ url: "/fotos_detalle/rise_1.jpg", text: "rise 01" }, { url: "/fotos_detalle/rise_2.jpg", text: "rise 02" }, { url: "/fotos_detalle/rise_3.jpg", text: "rise 03" }, { url: "/fotos_detalle/rise_4.jpg", text: "rise 04" }, { url: "/fotos_detalle/rise_5.jpg", text: "rise 05" }, { url: "/fotos_detalle/rise_6.jpg", text: "rise 06" }, { url: "/fotos_detalle/rise_7.jpg", text: "rise 07" }, { url: "/fotos_detalle/rise_8.jpg", text: "rise 08" }];
  const gallery7 = [{ url: "/fotos_detalle/sad_1.jpg", text: "san 01" }, { url: "/fotos_detalle/sad_2.jpg", text: "san 02" }, { url: "/fotos_detalle/sad_3.jpg", text: "san 03" }, { url: "/fotos_detalle/sad_4.jpg", text: "san 04" }, { url: "/fotos_detalle/sad_5.jpg", text: "san 05" }, { url: "/fotos_detalle/sad_6.jpg", text: "san 06" }, { url: "/fotos_detalle/sad_7.jpg", text: "san 07" }, { url: "/fotos_detalle/sad_8.jpg", text: "san 08" }];
  const gallery8 = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }, { url: "/fotos_detalle/vora_3.jpg", text: "vora 03" }, { url: "/fotos_detalle/vora_4.jpg", text: "vora 04" }, { url: "/fotos_detalle/vora_5.jpg", text: "vora 05" }, { url: "/fotos_detalle/vora_6.jpg", text: "vora 06" }, { url: "/fotos_detalle/vora_7.jpg", text: "vora 07" }, { url: "/fotos_detalle/vora_8.jpg", text: "vora 08" }];

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", gallery: gallery1, desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, extraTexts: ["la fragmentación del tiempo.", "código estético.", "máquina e instinto."] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", gallery: gallery2, desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, extraTexts: ["espacios asimétricos.", "oda a lo efímero.", "romper el equilibrio."] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", gallery: gallery3, desc: "exploración rítmica del espacio en blanco.", info: { date: "2024", location: "madrid", role: "visual design" }, extraTexts: ["el lienzo como campo.", "ritmos del fallo.", "anomalía estética."] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", gallery: gallery4, desc: "el contraste extremo define la forma.", info: { date: "2022", location: "london", role: "creative lead" }, extraTexts: ["luz y sombra.", "legibilidad extrema.", "esencia de la forma."] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", gallery: gallery5, desc: "abstracción aplicada al diseño contemporáneo.", info: { date: "2023", location: "berlin", role: "photography" }, extraTexts: ["realidad tras un filtro.", "descomponer el entorno.", "invisible cotidiano."] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", gallery: gallery6, desc: "fragmentos de un proceso inacabado.", info: { date: "2024", location: "paris", role: "concept" }, extraTexts: ["evolución constante.", "transformación formal.", "texturas narrativas."] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", gallery: gallery7, desc: "capturando la esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, extraTexts: ["tensión dinámica.", "movimiento congelado.", "diálogo cinemático."] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", gallery: gallery8, desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["máxima claridad.", "interfaz pura.", "eficiencia mínima."] }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];
  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig); const mouseY = useSpring(0, springConfig);
  const [leftTextPositions, setLeftTextPositions] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (view === "projects") {
      const positions = projects.map(() => ({ top: Math.floor(Math.random() * 60 + 15) + "vh", left: Math.floor(Math.random() * 70 + 10) + "vw", rotation: (Math.random() * 10 - 5) + "deg" }));
      setProjectPositions(positions);
    }
    if (view === "detail") {
      setDetailInfoPositions({ date: { top: "4vh", right: "15vw" }, location: { top: "6vh", right: "8vw" }, role: { top: "4vh", right: "2vw" } });
      setLeftTextPositions([{ top: "15vh", left: "4vw", rotate: "-3deg" }, { top: "78vh", left: "12vw", rotate: "4deg" }, { top: "40vh", left: "20vw", rotate: "-2deg" }]);
    }
  }, [view]);

  const openProject = (proj) => { setSelectedProject(proj); setView("detail"); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const getImageBrightness = (imgElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 50; canvas.height = 50;
    try {
      ctx.drawImage(imgElement, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) { sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; }
      const avg = sum / (data.length / 4);
      setCursorColor(avg > 128 ? "#000000" : "#ffffff");
    } catch (e) { setCursorColor("#000000"); }
  };

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: crosshair !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NAV */}
      <nav style={{ fontFamily: fontTitle, fontSize: "0.8rem", textTransform: "lowercase" }}>
        <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", top: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer" }}>giulia</div>
        {view !== "home" && (
          <>
            <div onClick={() => {setView("projects"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
            <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
          </>
        )}
      </nav>

      {/* CURSOR DETALLE */}
      {view === "detail" && selectedProject && (
        <motion.div style={{ position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999, padding: "12px", fontFamily: fontTitle, fontSize: "0.6rem", color: cursorColor, transition: "color 0.3s ease", textTransform: "lowercase", display: "flex", flexDirection: "column", maxWidth: "200px" }}>
          <AnimatePresence mode="wait">
            <motion.span key={hoveredIndex !== null ? `text-${hoveredIndex}` : 'title'} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
              {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") : selectedProject.title}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setView("projects")} style={{ height: "100vh", cursor: "pointer", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
              <UnicornScene projectId="6CDAlrVFBvrqq2Ou0GA3" className="unicorn-canvas" style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <ImageTrail images={trailImages} />
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" }}>
              <h1 style={{ fontFamily: fontTitle, fontSize: "1.2rem", letterSpacing: "2px" }}>GIULIA STUDIO</h1>
              <p style={{ fontFamily: fontBody, fontSize: "0.7rem", marginTop: "8px", opacity: 0.5 }}>click to enter</p>
            </div>
          </motion.div>
        )}

        {view === "projects" && (
          <motion.div key="projects" ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Crosshair containerRef={containerRef} color={kleinBlue} />
            {projects.map((proj, index) => (
              <motion.div key={proj.id} drag dragConstraints={containerRef} onClick={() => openProject(proj)} style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: "150px", cursor: "pointer", zIndex: 10 }}>
                <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseOver={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseOut={e => e.currentTarget.style.filter="grayscale(100%)"} />
                <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "detail" && selectedProject && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <Crosshair color={kleinBlue} />
            <div style={{ position: "fixed", top: 0, right: 0, width: "30vw", height: "15vh", zIndex: 500, fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase", color: kleinBlue }}>
              <motion.p animate={{ ...detailInfoPositions.role }} style={{ position: "absolute" }}>{selectedProject.info.role}</motion.p>
              <motion.p animate={{ ...detailInfoPositions.location }} style={{ position: "absolute" }}>{selectedProject.info.location}</motion.p>
              <motion.p animate={{ ...detailInfoPositions.date }} style={{ position: "absolute" }}>{selectedProject.info.date}</motion.p>
            </div>

            <div style={{ display: "flex", padding: "0 4vw" }}>
              <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0 }}>
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "100%" }}>
                  <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.8" }}>{selectedProject.title}</h1>
                  <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "1rem", maxWidth: "20vw", lineHeight: "1.4", opacity: 0.8 }}>{selectedProject.desc}</p>
                </div>
                {selectedProject.extraTexts?.map((text, i) => (
                  <motion.p key={i} animate={{ ...leftTextPositions[i], y: [0, -20, 0] }} transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 } }} style={{ position: "absolute", fontFamily: fontBody, fontSize: "0.65rem", maxWidth: "12vw", opacity: 0.4 }}>{text}</motion.p>
                ))}
              </div>

              <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                {selectedProject.gallery.map((item, i) => (
                  <motion.div key={i} onMouseEnter={(e) => { setHoveredIndex(i); const img = e.currentTarget.querySelector("img"); if (img) getImageBrightness(img); }} onMouseLeave={() => { setHoveredIndex(null); setCursorColor("#000000"); }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ width: (i + 1) % 3 === 0 ? "100%" : "70%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                    {item.url.endsWith(".mp4") ? <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%", height: "auto" }} /> : <img src={item.url} crossOrigin="anonymous" style={{ width: "100%", height: "auto" }} />}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100vw", height: "100vh", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Crosshair color="#000" />
            <div style={{ textAlign: "center", maxWidth: "450px" }}>
              <p style={{ fontFamily: fontBody, fontSize: "1rem", lineHeight: "1.6" }}>Directora creativa explorando la intersección entre el error digital y la armonía orgánica.</p>
              <div style={{ marginTop: "40px", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>
                <p>giulia@studio.com</p>
                <p style={{ marginTop: "10px" }}>+34 600 000 000</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}