"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair"; 
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// --- COMPONENTE LOADER DE PALABRAS ---
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

// --- COMPONENTE DE SOMBRA REACTIVA (GRADIENT MEJORADO Y RESPONSIVE) ---
const MouseShadowEffect = ({ mouseX, mouseY }) => {
  const scale = useTransform(
    [mouseX, mouseY],
    ([x, y]) => {
      if (typeof window === 'undefined') return 1;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      // La escala ahora es más sensible al movimiento
      return 1 + (dist / maxDist) * 0.25;
    }
  );

  return (
    <motion.div
      style={{
        position: "fixed", // Cambiado a fixed para que siga el viewport
        left: "-50vw", 
        top: "-50vh", 
        x: mouseX, 
        y: mouseY, 
        scale: scale, 
        width: "100vw", 
        height: "100vh", 
        pointerEvents: "none", 
        zIndex: 1,
        // Degradado más complejo y profundo
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(0, 47, 167, 0.25) 0%, rgba(0, 47, 167, 0.1) 30%, rgba(0, 255, 255, 0.05) 50%, transparent 75%),
          radial-gradient(circle at 40% 40%, rgba(128, 0, 128, 0.1) 0%, transparent 60%)
        `,
        // El blur ahora es más grande para suavizar los bordes en pantallas grandes
        filter: "blur(80px) saturate(150%) contrast(110%)", 
        mixBlendMode: "multiply",
        opacity: 0.8
      }}
    >
      {/* Capa de ruido orgánico */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, 
        backgroundRepeat: "repeat", 
        opacity: 0.15, 
        mixBlendMode: "overlay" 
      }} />
    </motion.div>
  );
};

export default function Home() {
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false); // Para evitar errores de hidratación
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); 
  const [detailInfoPositions, setDetailInfoPositions] = useState({});
  const [cursorColor, setCursorColor] = useState("#000000");
  const containerRef = useRef(null);

  // Galerías (Mantenidas intactas)
  const gallery1 = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }, { url: "/fotos_detalle/24_6.jpg", text: "frame 06" }, { url: "/fotos_detalle/24_7.jpg", text: "frame 07" }, { url: "/fotos_detalle/24_8.jpg", text: "frame 08" }];
  const gallery2 = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_9.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_10.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_11.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_12.jpg", text: "vuelo 08" }];
  const gallery3 = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.png", text: "After studying..." }, { url: "/fotos_detalle/bf_6.png", text: "fail 06" }, { url: "/fotos_detalle/bf_7.png", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const gallery4 = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }, { url: "/fotos_detalle/led_5.jpg", text: "light 05" }, { url: "/fotos_detalle/led_6.png", text: "light 06" }, { url: "/fotos_detalle/led_5.png", text: "light 07" }, { url: "/fotos_detalle/led_8.jpg", text: "light 08" }, { url: "/fotos_detalle/led_7.jpg", text: "light 07" }, { url: "/fotos_detalle/led_9.jpg", text: "light 08" }, { url: "/fotos_detalle/led_9.png", text: "light 07" }, { url: "/fotos_detalle/led_10.png", text: "light 08" }, { url: "/fotos_detalle/led_11.png", text: "light 07" },{ url: "/fotos_detalle/led_12.png", text: "light 07" }, { url: "/fotos_detalle/led_13.png", text: "light 07" }];
  const gallery5 = [{ url: "/fotos_detalle/moria_1.jpg", text: "moria 01" }, { url: "/fotos_detalle/moria_2.jpg", text: "moria 02" }, { url: "/fotos_detalle/moria_3.jpg", text: "moria 03" }, { url: "/fotos_detalle/moria_4.jpg", text: "moria 04" }, { url: "/fotos_detalle/moria_5.jpg", text: "moria 05" }, { url: "/fotos_detalle/moria_6.jpg", text: "moria 06" }, { url: "/fotos_detalle/moria_7.jpg", text: "moria 07" }, { url: "/fotos_detalle/moria_8.jpg", text: "moria 08" }];
  const gallery6 = [{ url: "/fotos_detalle/rise_1.jpg", text: "rise 01" }, { url: "/fotos_detalle/rise_2.jpg", text: "rise 02" }, { url: "/fotos_detalle/rise_3.jpg", text: "rise 03" }, { url: "/fotos_detalle/rise_4.jpg", text: "rise 04" }, { url: "/fotos_detalle/rise_5.jpg", text: "rise 05" }, { url: "/fotos_detalle/rise_6.jpg", text: "rise 06" }, { url: "/fotos_detalle/rise_7.jpg", text: "rise 07" }, { url: "/fotos_detalle/rise_8.jpg", text: "rise 08" }];
  const gallery7 = [{ url: "/fotos_detalle/sad_1.jpg", text: "san 01" }, { url: "/fotos_detalle/sad_2.jpg", text: "san 02" }, { url: "/fotos_detalle/sad_3.jpg", text: "san 03" }, { url: "/fotos_detalle/sad_4.jpg", text: "san 04" }, { url: "/fotos_detalle/sad_5.jpg", text: "san 05" }, { url: "/fotos_detalle/sad_6.jpg", text: "san 06" }, { url: "/fotos_detalle/sad_7.jpg", text: "san 07" }, { url: "/fotos_detalle/sad_8.jpg", text: "san 08" }];
  const gallery8 = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }, { url: "/fotos_detalle/vora_3.jpg", text: "vora 03" }, { url: "/fotos_detalle/vora_4.jpg", text: "vora 04" }, { url: "/fotos_detalle/vora_5.jpg", text: "vora 05" }, { url: "/fotos_detalle/vora_6.jpg", text: "vora 06" }, { url: "/fotos_detalle/vora_7.jpg", text: "vora 07" }, { url: "/fotos_detalle/vora_8.jpg", text: "vora 08" }];
  const gallery9 = [{ url: "/fotos_detalle/space_01.png", text: "vora 01" }, { url: "/fotos_detalle/space_02.png", text: "vora 02" }, { url: "/fotos_detalle/space_03.png", text: "vora 03" }, { url: "/fotos_detalle/space_04.png", text: "vora 04" }, { url: "/fotos_detalle/space_05.png", text: "vora 05" }, { url: "/fotos_detalle/space_06.png", text: "vora 06" }, { url: "/fotos_detalle/space_07.png", text: "vora 07" }, { url: "/fotos_detalle/space_08.png", text: "vora 08" }];
  const gallery10 = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }, { url: "/fotos_detalle/vora_3.jpg", text: "vora 03" }, { url: "/fotos_detalle/vora_4.jpg", text: "vora 04" }, { url: "/fotos_detalle/vora_5.jpg", text: "vora 05" }, { url: "/fotos_detalle/vora_6.jpg", text: "vora 06" }, { url: "/fotos_detalle/vora_7.jpg", text: "vora 07" }, { url: "/fotos_detalle/vora_8.jpg", text: "vora 08" }];
  

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", gallery: gallery1, desc: "una búsqueda de la armonía en el error digital.", info: { date: "2024", location: "barcelona", role: "creative direction" }, extraTexts: ["la fragmentación del tiempo se convierte en una herramienta de diseño.", "exploramos cómo el código puede fallar de manera estética.", "simbiosis entre la máquina y el instinto visual."] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", gallery: gallery2, desc: "la imperfección como lenguaje visual predominante.", info: { date: "2023", location: "milan", role: "art direction" }, extraTexts: ["espacios que respiran a través de la asimetría.", "una oda a la belleza de lo efímero.", "geometrías que se rompen para equilibrar."] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", gallery: gallery3, desc: "exploración rítmica del espacio en blanco.", info: { date: "2024", location: "madrid", role: "visual design" }, extraTexts: ["el lienzo como campo de fuerza.", "ritmos visuales que nacen del fallo.", "investigación sobre la anomalía estética."] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", gallery: gallery4, desc: "el contraste extremo define la forma.", info: { date: "2022", location: "london", role: "creative lead" }, extraTexts: ["la luz y la sombra esculpen la identidad.", "estudio sobre la legibilidad extrema.", "reducción de la forma a su esencia."] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", gallery: gallery5, desc: "abstracción aplicada al diseño contemporáneo.", info: { date: "2023", location: "berlin", role: "photography" }, extraTexts: ["capturando la realidad tras un filtro.", "la fotografía descompone el entorno.", "buscar lo invisible en lo cotidiano."] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", gallery: gallery6, desc: "fragmentos de un proceso inacabado.", info: { date: "2024", location: "paris", role: "concept" }, extraTexts: ["la belleza de la evolución constante.", "transformación formal y ascendencia.", "texturas que narran su propia creación."] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", gallery: gallery7, desc: "capturando la esencia del movimiento estático.", info: { date: "2023", location: "barcelona", role: "production" }, extraTexts: ["tensión visual entre lo quieto y lo dinámico.", "el movimiento congelado en patrones.", "diálogo entre cinemática e imagen fija."] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", gallery: gallery8, desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] },
    { id: 9, title: "space creation set", img: "/fotos_portadas/Portada_shoot LAMP.png", gallery: gallery9, desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] },
    { id: 10, title: "product render", img: "/fotos_portadas/Portada_product render.jpg", gallery: gallery10, desc: "reducción visual al mínimo exponente.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];
  const [navPositions, setNavPositions] = useState({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
  const [aboutPositions, setAboutPositions] = useState({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
  const [leftTextPositions, setLeftTextPositions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const springConfig = { stiffness: 250, damping: 30 };
  const mouseX = useSpring(0, springConfig); 
  const mouseY = useSpring(0, springConfig);
  
  const kleinBlue = "#002FA7"; 
  const fontTitle = "'Monor', monospace"; 
  const fontBody = "'Roundo', sans-serif";

  // --- EFECTOS ---
  useEffect(() => {
    setHasMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => { 
        mouseX.set(e.clientX); 
        mouseY.set(e.clientY); 
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (view === "home") setNavPositions({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
    if (view === "about") setAboutPositions({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
    if (view === "projects") {
      const positions = projects.map(() => ({ top: Math.floor(Math.random() * 60 + 15) + "vh", left: Math.floor(Math.random() * 70 + 10) + "vw", rotation: (Math.random() * 10 - 5) + "deg" }));
      setProjectPositions(positions);
    }
    if (view === "detail") {
      setDetailInfoPositions({ 
        date: { top: "5vh", right: "15vw", rotate: "0deg" }, 
        location: { top: "8vh", right: "8vw", rotate: "1deg" }, 
        role: { top: "4vh", right: "2vw", rotate: "-1deg" } 
      });
      setLeftTextPositions([{ top: "15vh", left: "4vw", rotate: "-3deg" }, { top: "78vh", left: "12vw", rotate: "4deg" }, { top: "40vh", left: "20vw", rotate: "-2deg" }]);
    }
  }, [view]);

  const openProject = (proj) => { setSelectedProject(proj); setView("detail"); window.scrollTo({ top: 0, behavior: 'instant' }); };

  const getImageBrightness = (imgElement) => {
    const analyze = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 50; canvas.height = 50;
      try {
        ctx.drawImage(imgElement, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        const avg = sum / (data.length / 4);
        setCursorColor(avg > 128 ? "#000000" : "#ffffff");
      } catch (e) {
        setCursorColor("#000000");
      }
    };
    if (imgElement.complete) analyze(); else imgElement.onload = analyze;
  };

  // Prevenir renderizado hasta que el cliente esté listo
  if (!hasMounted) return <div style={{backgroundColor: "white", height: "100vh"}} />;

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: crosshair !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {/* NAV */}
            <nav>
              <AnimatePresence>
                {view === "home" ? (
                  <>
                    <motion.h1 onClick={() => setView("home")} animate={{ ...navPositions.giulia }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.9rem", textDecoration: "line-through", zIndex: 1000, cursor: "pointer" }}>giulia</motion.h1>
                    <motion.div onClick={() => setView("projects")} animate={{ ...navPositions.projects }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>projects</motion.div>
                    <motion.div onClick={() => setView("about")} animate={{ ...navPositions.about }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.8rem", zIndex: 1000, cursor: "pointer" }}>about</motion.div>
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

            {/* CURSOR DETALLE */}
            {view === "detail" && selectedProject && (
              <motion.div style={{ 
                  position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999, 
                  padding: "12px", fontFamily: fontTitle, fontSize: "0.6rem", color: cursorColor,
                  textTransform: "lowercase", display: "flex", flexDirection: "column" 
              }}>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={hoveredIndex !== null ? `text-${hoveredIndex}` : 'title'} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {hoveredIndex !== null ? (selectedProject.gallery[hoveredIndex]?.text || "detalle") : selectedProject.title}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {view === "home" && <motion.div key="home" style={{height: "100vh"}}><ImageTrail images={trailImages} /></motion.div>}

              {view === "projects" && (
                <motion.div key="projects" ref={containerRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
                  <MouseShadowEffect mouseX={mouseX} mouseY={mouseY} />
                  <Crosshair containerRef={containerRef} color={kleinBlue} />
                  {projects.map((proj, index) => (
                    <motion.div 
                      key={proj.id} drag dragConstraints={containerRef} onClick={() => openProject(proj)} 
                      style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: "150px", cursor: "pointer", zIndex: 10 }}>
                      <motion.img src={proj.img} whileHover={{ scale: 1.05 }} style={{ width: "100%", filter: "grayscale(100%)" }} onMouseEnter={e => e.currentTarget.style.filter="grayscale(0%)"} onMouseLeave={e => e.currentTarget.style.filter="grayscale(100%)"} />
                      <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {view === "about" && (
                <motion.div key="about" style={{ width: "100vw", height: "100vh", position: "relative" }}>
                  <Crosshair color="#000" />
                  <motion.p animate={{ ...aboutPositions.email }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giulia@studio.com</motion.p>
                  <motion.p animate={{ ...aboutPositions.phone }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+34 600 000 000</motion.p>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0 20vw", textAlign: "center" }}>
                    <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "450px", lineHeight: "1.6" }}>Directora creativa explorando la intersección entre el error digital y la armonía orgánica.</p>
                  </div>
                </motion.div>
              )}

              {view === "detail" && selectedProject && (
                <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh" }}>
                  <Crosshair color={kleinBlue} />
                  <div style={{ position: "fixed", top: 0, right: 0, width: "30vw", height: "15vh", zIndex: 500, fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase", color: kleinBlue }}>
                    <motion.p animate={{ ...detailInfoPositions.role }} style={{ position: "absolute" }}>{selectedProject.info.role}</motion.p>
                    <motion.p animate={{ ...detailInfoPositions.location }} style={{ position: "absolute" }}>{selectedProject.info.location}</motion.p>
                    <motion.p animate={{ ...detailInfoPositions.date }} style={{ position: "absolute" }}>{selectedProject.info.date}</motion.p>
                  </div>

                  <div style={{ display: "flex", padding: "0 4vw" }}>
                    <div style={{ width: "35vw", height: "100vh", position: "sticky", top: 0 }}>
                      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: "100%" }}>
                        <h1 style={{ fontFamily: fontTitle, fontSize: "4.5vw", color: kleinBlue, lineHeight: "0.8" }}>{selectedProject.title}</h1>
                        <p style={{ fontFamily: fontBody, fontSize: "0.9rem", marginTop: "1rem", maxWidth: "20vw", lineHeight: "1.4", opacity: 0.8 }}>{selectedProject.desc}</p>
                      </div>
                      {selectedProject.extraTexts?.map((text, i) => (
                        <motion.p key={i} animate={{ ...leftTextPositions[i] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", fontFamily: fontBody, fontSize: "0.65rem", maxWidth: "12vw", opacity: 0.4 }}>{text}</motion.p>
                      ))}
                    </div>

                    <div style={{ width: "65vw", paddingTop: "25vh", paddingBottom: "25vh", display: "flex", flexDirection: "column", gap: "30vh" }}>
                      {selectedProject.gallery.map((item, i) => (
                        <motion.div
                          key={i}
                          onMouseEnter={(e) => {
                            setHoveredIndex(i);
                            const img = e.currentTarget.querySelector("img");
                            if (img) getImageBrightness(img);
                          }}
                          onMouseLeave={() => { setHoveredIndex(null); setCursorColor("#000000"); }}
                          style={{ width: (i + 1) % 3 === 0 ? "100%" : "70%", alignSelf: i % 2 === 0 ? "flex-end" : "flex-start" }}
                        >
                          {item.url.endsWith(".mp4") ? (
                            <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%" }} />
                          ) : (
                            <img src={item.url} crossOrigin="anonymous" style={{ width: "100%" }} />
                          )}
                        </motion.div>
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