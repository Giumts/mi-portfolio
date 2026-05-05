"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair";
import ScrambledText from "./ScrambledText";
import { motion, AnimatePresence, useSpring } from "framer-motion";

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



export default function Home() {
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false); // Para evitar errores de hidratación
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorColor, setCursorColor] = useState("#000000");
  const [imagesHovered, setImagesHovered] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [filterRole, setFilterRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

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
  const gallery10 = [{ url: "/fotos_detalle/product_01.jpg", text: "vora 01" }, { url: "/fotos_detalle/product_02.jpg", text: "vora 02" }, { url: "/fotos_detalle/product_03.png", text: "vora 03" }, { url: "/fotos_detalle/product_04.png", text: "vora 04" }, { url: "/fotos_detalle/product_05.png", text: "vora 05" }, { url: "/fotos_detalle/product_06.jpg", text: "vora 06" }, { url: "/fotos_detalle/product_07.png", text: "vora 07" }, { url: "/fotos_detalle/product_08.png", text: "vora 08" }];
  

  const projects = [
    { id: 1, title: "24 seconds", img: "/fotos_portadas/Portada_24 seconds.jpg", gallery: gallery1, desc: "una búsqueda de la armonía en el error digital. la fragmentación del tiempo como herramienta creativa, donde el fallo se convierte en forma y el ruido en ritmo.", info: { date: "2024", location: "barcelona", role: "creative direction" }, extraTexts: ["la fragmentación del tiempo se convierte en una herramienta de diseño.", "exploramos cómo el código puede fallar de manera estética.", "simbiosis entre la máquina y el instinto visual."] },
    { id: 2, title: "aria libera", img: "/fotos_portadas/Portada_Aria libera.jpg", gallery: gallery2, desc: "la imperfección como lenguaje visual predominante. espacios que respiran a través de la asimetría, donde cada elemento incompleto construye una nueva lectura del todo.", info: { date: "2023", location: "milan", role: "art direction" }, extraTexts: ["espacios que respiran a través de la asimetría.", "una oda a la belleza de lo efímero.", "geometrías que se rompen para equilibrar."] },
    { id: 3, title: "beautiful failures", img: "/fotos_portadas/Portada_Beautiful failures.jpg", gallery: gallery3, desc: "exploración rítmica del espacio en blanco. el lienzo como campo de fuerza donde los ritmos visuales nacen del fallo y la anomalía se convierte en propuesta estética.", info: { date: "2024", location: "madrid", role: "visual design" }, extraTexts: ["el lienzo como campo de fuerza.", "ritmos visuales que nacen del fallo.", "investigación sobre la anomalía estética."] },
    { id: 4, title: "ledsc4", img: "/fotos_portadas/Portada_Ledsc4.jpg", gallery: gallery4, desc: "el contraste extremo define la forma. luz y sombra esculpen una identidad reducida a su esencia, explorando los límites de la legibilidad y la percepción visual.", info: { date: "2022", location: "london", role: "creative lead" }, extraTexts: ["la luz y la sombra esculpen la identidad.", "estudio sobre la legibilidad extrema.", "reducción de la forma a su esencia."] },
    { id: 5, title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg", gallery: gallery5, desc: "abstracción aplicada al diseño contemporáneo. la fotografía descompone el entorno para capturar lo invisible en lo cotidiano, buscando la realidad tras el filtro.", info: { date: "2023", location: "berlin", role: "photography" }, extraTexts: ["capturando la realidad tras un filtro.", "la fotografía descompone el entorno.", "buscar lo invisible en lo cotidiano."] },
    { id: 6, title: "rise up", img: "/fotos_portadas/Portada_rise up.JPG", gallery: gallery6, desc: "fragmentos de un proceso inacabado. la belleza reside en la evolución constante, en las texturas que narran su propia creación y en la ascendencia formal como discurso.", info: { date: "2024", location: "paris", role: "concept" }, extraTexts: ["la belleza de la evolución constante.", "transformación formal y ascendencia.", "texturas que narran su propia creación."] },
    { id: 7, title: "san sadurnì", img: "/fotos_portadas/Portada_San sadurni.jpg", gallery: gallery7, desc: "capturando la esencia del movimiento estático. la tensión entre lo quieto y lo dinámico se cristaliza en patrones que dialogan entre la cinemática y la imagen fija.", info: { date: "2023", location: "barcelona", role: "production" }, extraTexts: ["tensión visual entre lo quieto y lo dinámico.", "el movimiento congelado en patrones.", "diálogo entre cinemática e imagen fija."] },
    { id: 8, title: "vora", img: "/fotos_portadas/Portada_vora.jpg", gallery: gallery8, desc: "reducción visual al mínimo exponente. una interfaz construida desde la claridad máxima, eliminando lo superfluo para que cada elemento presente tenga peso y significado.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] },
    { id: 9, title: "space creation set", img: "/fotos_portadas/Portada_Shoot LAMP.png", gallery: gallery9, desc: "objetos que definen el espacio que los rodea. una exploración sobre cómo la luz y la forma construyen atmósferas, donde cada pieza existe en diálogo con su entorno.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] },
    { id: 10, title: "product render", img: "/fotos_portadas/Portada_product render.jpg", gallery: gallery10, desc: "la imagen como argumento de venta y de deseo. renders que trascienden la representación técnica para construir una narrativa visual en torno al objeto y su contexto.", info: { date: "2024", location: "remote", role: "ui design" }, extraTexts: ["interfaz como espacio de máxima claridad.", "eliminación de lo superfluo.", "eficiencia visual con el mínimo elemento."] }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];
  const [navPositions, setNavPositions] = useState({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
  const [aboutPositions, setAboutPositions] = useState({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
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
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (view === "home") setNavPositions({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
    if (view === "about") setAboutPositions({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 52 + 18) + "vh",
        left: Math.floor(Math.random() * 52 + 20) + "vw",
        rotation: (Math.random() * 24 - 12) + "deg",
        width: Math.floor(Math.random() * 90 + 75) + "px",
      }));
      setProjectPositions(positions);
    }
  }, [view]);


  const openProject = (proj) => {
    setSelectedProject(proj);
    setView("detail");
    window.scrollTo({ top: 0, behavior: 'instant' });
  };


  // Prevenir renderizado hasta que el cliente esté listo
  if (!hasMounted) return <div style={{backgroundColor: "white", height: "100vh"}} />;

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <style jsx global>{`
        @font-face { font-family: 'Monor'; src: url('/fonts/Monor_Regular.otf') format('opentype'); }
        @font-face { font-family: 'Roundo'; src: url('/fonts/Roundo-Regular.otf') format('opentype'); }
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: none !important; }
        @media (max-width: 768px) { body, html, * { cursor: auto !important; } }
        ::-webkit-scrollbar { display: none; }
        .proj-thumb { filter: grayscale(100%); transition: filter 0.35s ease; will-change: transform; }
        .proj-thumb:hover { filter: grayscale(0%); }
        @keyframes floatDown {
          0%   { transform: translateY(0)       scale(0.85); opacity: 0;   }
          5%   { transform: translateY(60vh)    scale(0.9);  opacity: 0.7; }
          25%  { transform: translateY(320vh)   scale(1.0);  opacity: 0.7; }
          42%  { transform: translateY(520vh)   scale(1.4);  opacity: 0.7; }
          58%  { transform: translateY(700vh)   scale(1.0);  opacity: 0.7; }
          72%  { transform: translateY(850vh)   scale(1.3);  opacity: 0.7; }
          90%  { transform: translateY(1050vh)  scale(0.8);  opacity: 0.3; }
          97%  { transform: translateY(1150vh)  scale(0.7);  opacity: 0;   }
          100% { transform: translateY(1200vh)  scale(0.7);  opacity: 0;   }
        }
        .sc-char { will-change: transform; }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {!isMobile && <Crosshair color="#ffffff" showLines={view !== "home" && !imagesHovered} />}
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
                    <div onClick={() => {setView("projects"); setSelectedProject(null); setFilterRole(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
                    <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
                  </div>
                )}
              </AnimatePresence>
            </nav>

            {/* CURSOR DETALLE */}
            {view === "detail" && selectedProject && !isMobile && (
              <motion.div style={{
                  position: "fixed", left: 0, top: 0, x: mouseX, y: mouseY, pointerEvents: "none", zIndex: 9999,
                  padding: "12px", fontFamily: fontTitle, fontSize: "0.6rem", color: cursorColor,
                  textTransform: "lowercase", display: "flex", flexDirection: "column"
              }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={hoveredIndex !== null ? `text-${hoveredIndex}` : 'title'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ color: cursorColor }}
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

                  {/* Indicador de filtro */}
                  {filterRole && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ position: "absolute", top: "7vh", left: "50%", transform: "translateX(-50%)", zIndex: 600, fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase", color: "#aaa", display: "flex", alignItems: "center", gap: "0.6rem" }}
                    >
                      <span>{filterRole}</span>
                      <span onClick={() => setFilterRole(null)} style={{ cursor: "pointer", color: kleinBlue, fontSize: "0.8rem", lineHeight: 1 }}>×</span>
                    </motion.div>
                  )}

                  {/* Nube de imágenes */}
                  {projects.map((proj, index) => {
                    const isHidden = filterRole && proj.info.role !== filterRole;
                    return (
                      <motion.div
                        key={proj.id} drag dragConstraints={containerRef} onClick={() => openProject(proj)}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: isHidden ? 0 : 1, scale: isHidden ? 0.7 : 1, pointerEvents: isHidden ? "none" : "auto" }}
                        transition={{ type: "spring", stiffness: 60, damping: 14, delay: index * 0.06 }}
                        whileHover={{ scale: 1.08, zIndex: 200 }}
                        onMouseEnter={() => !isHidden && setHoveredProjectId(proj.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                        style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: projectPositions[index]?.width || "120px", cursor: "pointer", zIndex: 10 + index, willChange: "transform" }}
                      >
                        <img src={proj.img} className="proj-thumb" style={{ width: "100%", display: "block" }} />
                      </motion.div>
                    );
                  })}

                  {/* Línea de títulos */}
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ position: "absolute", bottom: "9vh", left: 0, right: 0, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 2.5rem", padding: "0 6vw", fontFamily: fontTitle, fontSize: "0.72rem", textTransform: "lowercase", zIndex: 500, pointerEvents: "none" }}
                  >
                    {projects.map((proj, i) => (
                      <motion.span
                        key={proj.id}
                        onClick={() => openProject(proj)}
                        animate={{ y: [0, -5, 0], color: hoveredProjectId === proj.id ? kleinBlue : (filterRole && proj.info.role !== filterRole ? "#ccc" : "#000"), opacity: hoveredProjectId === proj.id ? 1 : (filterRole && proj.info.role !== filterRole ? 0.25 : 0.55) }}
                        transition={{ y: { repeat: Infinity, duration: 3.2 + i * 0.25, ease: "easeInOut", delay: i * 0.4 }, color: { duration: 0.2 }, opacity: { duration: 0.2 } }}
                        whileHover={{ opacity: 1, color: kleinBlue }}
                        style={{ cursor: "pointer", pointerEvents: "auto", display: "inline-block" }}
                      >{proj.title}</motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {view === "about" && (
                <motion.div key="about" style={{ width: "100vw", height: "100vh", position: "relative" }}>
                  <motion.p animate={{ ...aboutPositions.email }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giulia@studio.com</motion.p>
                  <motion.p animate={{ ...aboutPositions.phone }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+34 600 000 000</motion.p>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0 20vw", textAlign: "center" }}>
                    <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "450px", lineHeight: "1.6" }}>Directora creativa explorando la intersección entre el error digital y la armonía orgánica.</p>
                  </div>
                </motion.div>
              )}

              {view === "detail" && selectedProject && (
                isMobile ? (
                  <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh" }}>
                    <div style={{ padding: "14vh 6vw 4vh" }}>
                      <h1 style={{ fontFamily: fontTitle, fontSize: "12vw", color: kleinBlue, lineHeight: "0.85" }}>{selectedProject.title}</h1>
                      <p style={{ fontFamily: fontBody, fontSize: "0.85rem", marginTop: "1.2rem", lineHeight: "1.5", opacity: 0.8 }}>{selectedProject.desc}</p>
                      <div style={{ display: "flex", gap: "5vw", marginTop: "1rem", fontFamily: fontTitle, fontSize: "0.6rem", color: kleinBlue, textTransform: "lowercase", flexWrap: "wrap" }}>
                        <span>{selectedProject.info.role}</span>
                        <span>{selectedProject.info.location}</span>
                        <span>{selectedProject.info.date}</span>
                      </div>
                    </div>

                    <div ref={carouselRef} style={{ width: "100vw", height: "65vw", overflow: "hidden", marginTop: "4vh" }}>
                      <motion.div
                        drag="x"
                        dragConstraints={carouselRef}
                        dragElastic={0.05}
                        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                        style={{ display: "flex", height: "100%", width: `${selectedProject.gallery.length * 100}%` }}
                      >
                        {selectedProject.gallery.map((item, i) => (
                          <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2vw 3vw" }}>
                            {item.url.endsWith(".mp4") ? (
                              <video src={item.url} autoPlay muted loop playsInline style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", pointerEvents: "none" }} />
                            ) : (
                              <img src={item.url} draggable={false} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", userSelect: "none" }} />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    <div style={{ padding: "8vh 6vw", display: "flex", flexDirection: "column", gap: "8vh" }}>
                      {selectedProject.gallery.map((item, i) => (
                        <div key={i}>
                          {item.url.endsWith(".mp4") ? (
                            <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%" }} />
                          ) : (
                            <img src={item.url} style={{ width: "100%" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh", position: "relative",  }}>
                    <motion.div
                      key={selectedProject.title + "-info"}
                      style={{ position: "fixed", right: "3vw", top: "50vh", transform: "translateY(-50%)", zIndex: 500, display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: fontTitle, fontSize: "0.75rem", textTransform: "lowercase", color: "#aaa", pointerEvents: "none", textAlign: "right" }}
                    >
                      {[selectedProject.info.role, selectedProject.info.location, selectedProject.info.date].map((val, i) => (
                        <motion.span
                          key={val}
                          initial={{ scale: 1.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: i * 0.18, opacity: { duration: 1.2, ease: "easeOut", delay: i * 0.18 } }}
                          onClick={i === 0 ? () => { setFilterRole(val); setSelectedProject(null); setView("projects"); } : undefined}
                          style={i === 0 ? { cursor: "pointer", pointerEvents: "auto", textDecoration: "underline", textUnderlineOffset: "3px" } : {}}
                        >{val}</motion.span>
                      ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2, ease: "easeIn" }} style={{ position: "absolute", top: 0, left: 0, width: "35vw", height: "100%", pointerEvents: "none", zIndex: 10, overflow: "hidden" }}>
                      {(() => {
                        const texts = selectedProject.extraTexts || [];
                        const slots = [
                          { left: "2vw",  rotate: "-2deg", delay: "0s"    },
                          { left: "24vw", rotate: "3deg",  delay: "-25s"  },
                          { left: "11vw", rotate: "-1deg", delay: "-50s"  },
                          { left: "17vw", rotate: "2deg",  delay: "-75s"  },
                          { left: "5vw",  rotate: "1deg",  delay: "-100s" },
                          { left: "28vw", rotate: "-2deg", delay: "-15s"  },
                        ];
                        return slots.map((fc, j) => {
                          const text = texts[j % texts.length];
                          return (
                            <div key={j} style={{ position: "absolute", top: 0, left: fc.left, rotate: fc.rotate, animation: `floatDown 130s linear ${fc.delay} infinite`, pointerEvents: "auto", cursor: "crosshair" }}>
                              <ScrambledText
                                radius={90}
                                duration={0.9}
                                scrambleChars=".:"
                                style={{ fontFamily: "'Almendra Display', serif", fontSize: "1.1rem", maxWidth: "14vw", color: "#222", lineHeight: 1.4 }}
                              >
                                {text}
                              </ScrambledText>
                            </div>
                          );
                        });
                      })()}
                    </motion.div>

                    {/* Header centrado */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20vh 10vw 12vh" }}>
                      <span style={{ fontFamily: fontTitle, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.3, marginBottom: "3rem" }}>
                        {String(selectedProject.id).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                      </span>
                      <h1 style={{ fontFamily: fontTitle, fontSize: "9vw", color: kleinBlue, lineHeight: "0.85", letterSpacing: "-0.025em", maxWidth: "80vw" }}>
                        {selectedProject.title}
                      </h1>
                      <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "36vw", lineHeight: "1.8", opacity: 0.55, marginTop: "2.5rem" }}>
                        {selectedProject.desc}
                      </p>

                    </div>

                    <div style={{ width: "80vw", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14vh", paddingBottom: "25vh" }}>
                          {(() => {
                            const layouts = [
                              { width: "44vw", alignSelf: "flex-start", ml: "4vw",  cx: 30 },
                              { width: "50vw", alignSelf: "flex-end",   mr: "2vw",  cx: 66 },
                              { width: "38vw", alignSelf: "flex-start", ml: "18vw", cx: 47 },
                              { width: "56vw", alignSelf: "flex-end",   mr: "4vw",  cx: 58 },
                              { width: "46vw", alignSelf: "flex-start", ml: "6vw",  cx: 35 },
                              { width: "40vw", alignSelf: "flex-end",   mr: "12vw", cx: 62 },
                              { width: "52vw", alignSelf: "flex-start", ml: "0vw",  cx: 33 },
                              { width: "42vw", alignSelf: "flex-end",   mr: "6vw",  cx: 67 },
                            ];
                            return selectedProject.gallery.map((item, i) => {
                              const lay = layouts[i % layouts.length];
                              const delay = i * 0.45;
                              return (
                                <Fragment key={i}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: [30, 0, -5, 0] }}
                                    transition={{ opacity: { duration: 0.6, delay: delay + 0.15 }, y: { duration: 0.8, ease: "easeOut", delay: delay + 0.15, times: [0, 0.7, 0.85, 1] } }}
                                    onMouseEnter={() => { setHoveredIndex(i); setCursorColor("#ffffff"); setImagesHovered(true); }}
                                    onMouseLeave={() => { setHoveredIndex(null); setCursorColor("#000000"); setImagesHovered(false); }}
                                    style={{ width: lay.width, alignSelf: lay.alignSelf, marginLeft: lay.ml, marginRight: lay.mr }}
                                  >
                                    {item.url.endsWith(".mp4") ? (
                                      <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%", display: "block" }} />
                                    ) : (
                                      <img src={item.url} crossOrigin="anonymous" style={{ width: "100%", display: "block" }} />
                                    )}
                                  </motion.div>
                                </Fragment>
                              );
                            });
                          })()}
                        </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}