"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair";
import { motion, AnimatePresence } from "framer-motion";


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
  const [imagesHovered, setImagesHovered] = useState(false);
  const [carouselArrow, setCarouselArrow] = useState('→');
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [filterRole, setFilterRole] = useState(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const dragStartRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const colorCacheRef = useRef({});
  const [gradientColors, setGradientColors] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  // Galerías — project / technical / development por proyecto
  const g1  = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }, { url: "/fotos_detalle/24_6.jpg", text: "frame 06" }, { url: "/fotos_detalle/24_7.jpg", text: "frame 07" }, { url: "/fotos_detalle/24_8.jpg", text: "frame 08" }];
  const g2  = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_9.jpg", text: "vuelo 09" }, { url: "/fotos_detalle/aria_10.jpg", text: "vuelo 10" }, { url: "/fotos_detalle/aria_11.jpg", text: "vuelo 11" }, { url: "/fotos_detalle/aria_12.jpg", text: "vuelo 12" }];
  const g3p = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.jpg", text: "fail 05" }, { url: "/fotos_detalle/bf_6.jpg", text: "fail 06" }, { url: "/fotos_detalle/bf_7.jpg", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const g3d = [{ url: "/fotos_detalle/bf_p01.png", text: "dev 01" }, { url: "/fotos_detalle/bf_p02.png", text: "dev 02" }, { url: "/fotos_detalle/bf_p03.png", text: "dev 03" }, { url: "/fotos_detalle/bf_p04.jpg", text: "dev 04" }, { url: "/fotos_detalle/bf_p05.png", text: "dev 05" }, { url: "/fotos_detalle/bf_p06.jpg", text: "dev 06" }, { url: "/fotos_detalle/bf_p07.png", text: "dev 07" }, { url: "/fotos_detalle/bf_p08.png", text: "dev 08" }];
  const g3t = [{ url: "/fotos_detalle/bf_T01.png", text: "tech 01" }, { url: "/fotos_detalle/bf_T02.png", text: "tech 02" }, { url: "/fotos_detalle/bf_T03.png", text: "tech 03" }, { url: "/fotos_detalle/bf_T04.png", text: "tech 04" }, { url: "/fotos_detalle/bf_T05.png", text: "tech 05" }, { url: "/fotos_detalle/bf_T06.png", text: "tech 06" }, { url: "/fotos_detalle/bf_T07.png", text: "tech 07" }];
  const g4  = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }, { url: "/fotos_detalle/led_5.jpg", text: "light 05" }, { url: "/fotos_detalle/led_6.png", text: "light 06" }, { url: "/fotos_detalle/led_5.png", text: "light 07" }, { url: "/fotos_detalle/led_8.jpg", text: "light 08" }, { url: "/fotos_detalle/led_7.jpg", text: "light 09" }, { url: "/fotos_detalle/led_9.jpg", text: "light 10" }, { url: "/fotos_detalle/led_9.png", text: "light 11" }, { url: "/fotos_detalle/led_10.png", text: "light 12" }, { url: "/fotos_detalle/led_11.png", text: "light 13" }, { url: "/fotos_detalle/led_12.png", text: "light 14" }, { url: "/fotos_detalle/led_13.png", text: "light 15" }];
  const g5  = [{ url: "/fotos_detalle/moria_1.jpg", text: "moria 01" }, { url: "/fotos_detalle/moria_2.jpg", text: "moria 02" }, { url: "/fotos_detalle/moria_3.jpg", text: "moria 03" }, { url: "/fotos_detalle/moria_4.jpg", text: "moria 04" }, { url: "/fotos_detalle/moria_5.jpg", text: "moria 05" }, { url: "/fotos_detalle/moria_6.jpg", text: "moria 06" }, { url: "/fotos_detalle/moria_7.jpg", text: "moria 07" }, { url: "/fotos_detalle/moria_8.jpg", text: "moria 08" }];
  const g6  = [{ url: "/fotos_detalle/rise_1.jpg", text: "rise 01" }, { url: "/fotos_detalle/rise_2.jpg", text: "rise 02" }, { url: "/fotos_detalle/rise_3.jpg", text: "rise 03" }, { url: "/fotos_detalle/rise_4.jpg", text: "rise 04" }, { url: "/fotos_detalle/rise_5.jpg", text: "rise 05" }, { url: "/fotos_detalle/rise_6.jpg", text: "rise 06" }, { url: "/fotos_detalle/rise_7.jpg", text: "rise 07" }, { url: "/fotos_detalle/rise_8.jpg", text: "rise 08" }];
  const g7  = [{ url: "/fotos_detalle/sad_1.jpg", text: "san 01" }, { url: "/fotos_detalle/sad_2.jpg", text: "san 02" }, { url: "/fotos_detalle/sad_3.jpg", text: "san 03" }, { url: "/fotos_detalle/sad_4.jpg", text: "san 04" }, { url: "/fotos_detalle/sad_5.jpg", text: "san 05" }, { url: "/fotos_detalle/sad_6.jpg", text: "san 06" }, { url: "/fotos_detalle/sad_7.jpg", text: "san 07" }, { url: "/fotos_detalle/sad_8.jpg", text: "san 08" }];
  const g8  = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }, { url: "/fotos_detalle/vora_3.jpg", text: "vora 03" }, { url: "/fotos_detalle/vora_4.jpg", text: "vora 04" }, { url: "/fotos_detalle/vora_5.jpg", text: "vora 05" }, { url: "/fotos_detalle/vora_6.jpg", text: "vora 06" }, { url: "/fotos_detalle/vora_7.jpg", text: "vora 07" }, { url: "/fotos_detalle/vora_8.jpg", text: "vora 08" }];
  const g9  = [{ url: "/fotos_detalle/space_01.png", text: "space 01" }, { url: "/fotos_detalle/space_02.png", text: "space 02" }, { url: "/fotos_detalle/space_03.png", text: "space 03" }, { url: "/fotos_detalle/space_04.png", text: "space 04" }, { url: "/fotos_detalle/space_05.png", text: "space 05" }, { url: "/fotos_detalle/space_06.png", text: "space 06" }, { url: "/fotos_detalle/space_07.png", text: "space 07" }, { url: "/fotos_detalle/space_08.png", text: "space 08" }];
  const g10 = [{ url: "/fotos_detalle/product_01.jpg", text: "prod 01" }, { url: "/fotos_detalle/product_02.jpg", text: "prod 02" }, { url: "/fotos_detalle/product_03.png", text: "prod 03" }, { url: "/fotos_detalle/product_04.png", text: "prod 04" }, { url: "/fotos_detalle/product_05.png", text: "prod 05" }, { url: "/fotos_detalle/product_06.jpg", text: "prod 06" }, { url: "/fotos_detalle/product_07.png", text: "prod 07" }, { url: "/fotos_detalle/product_08.png", text: "prod 08" }];

  const projects = [
    { id: 1,  title: "24 seconds",          img: "/fotos_portadas/Portada_24 seconds.jpg",        galleries: [g1,   g1,   g1  ], tech: ["after effects", "premiere", "resolve"],      desc: "una búsqueda de la armonía en el error digital. la fragmentación del tiempo como herramienta creativa, donde el fallo se convierte en forma y el ruido en ritmo.", info: { date: "2024", location: "barcelona", role: "creative direction" } },
    { id: 2,  title: "aria libera",          img: "/fotos_portadas/Portada_Aria libera.jpg",        galleries: [g2,   g2,   g2  ], tech: ["lightroom", "indesign", "illustrator"],      desc: "la imperfección como lenguaje visual predominante. espacios que respiran a través de la asimetría, donde cada elemento incompleto construye una nueva lectura del todo.", info: { date: "2023", location: "milan", role: "art direction" } },
    { id: 3,  title: "beautiful failures",   img: "/fotos_portadas/Portada_Beautiful failures.jpg", galleries: [g3p,  g3t,  g3d ], tech: ["photoshop", "illustrator", "indesign"],      desc: "exploración rítmica del espacio en blanco. el lienzo como campo de fuerza donde los ritmos visuales nacen del fallo y la anomalía se convierte en propuesta estética.", info: { date: "2024", location: "madrid", role: "visual design" } },
    { id: 4,  title: "ledsc4",               img: "/fotos_portadas/Portada_Ledsc4.jpg",              galleries: [g4,   g4,   g4  ], tech: ["after effects", "cinema 4d", "resolve"],     desc: "el contraste extremo define la forma. luz y sombra esculpen una identidad reducida a su esencia, explorando los límites de la legibilidad y la percepción visual.", info: { date: "2022", location: "london", role: "creative lead" } },
    { id: 5,  title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg",galleries: [g5,   g5,   g5  ], tech: ["lightroom", "capture one", "photoshop"],     desc: "abstracción aplicada al diseño contemporáneo. la fotografía descompone el entorno para capturar lo invisible en lo cotidiano, buscando la realidad tras el filtro.", info: { date: "2023", location: "berlin", role: "photography" } },
    { id: 6,  title: "rise up",              img: "/fotos_portadas/Portada_rise up.JPG",              galleries: [g6,   g6,   g6  ], tech: ["illustrator", "photoshop", "figma"],         desc: "fragmentos de un proceso inacabado. la belleza reside en la evolución constante, en las texturas que narran su propia creación y en la ascendencia formal como discurso.", info: { date: "2024", location: "paris", role: "concept" } },
    { id: 7,  title: "san sadurnì",          img: "/fotos_portadas/Portada_San sadurni.jpg",          galleries: [g7,   g7,   g7  ], tech: ["premiere", "lightroom", "after effects"],    desc: "capturando la esencia del movimiento estático. la tensión entre lo quieto y lo dinámico se cristaliza en patrones que dialogan entre la cinemática y la imagen fija.", info: { date: "2023", location: "barcelona", role: "production" } },
    { id: 8,  title: "vora",                 img: "/fotos_portadas/Portada_vora.jpg",                 galleries: [g8,   g8,   g8  ], tech: ["figma", "framer", "css"],                    desc: "reducción visual al mínimo exponente. una interfaz construida desde la claridad máxima, eliminando lo superfluo para que cada elemento presente tenga peso y significado.", info: { date: "2024", location: "remote", role: "ui design" } },
    { id: 9,  title: "space creation set",   img: "/fotos_portadas/Portada_Shoot LAMP.png",           galleries: [g9,   g9,   g9  ], tech: ["cinema 4d", "blender", "lightroom"],         desc: "objetos que definen el espacio que los rodea. una exploración sobre cómo la luz y la forma construyen atmósferas, donde cada pieza existe en diálogo con su entorno.", info: { date: "2024", location: "remote", role: "ui design" } },
    { id: 10, title: "product render",        img: "/fotos_portadas/Portada_product render.jpg",       galleries: [g10,  g10,  g10 ], tech: ["cinema 4d", "blender", "photoshop"],         desc: "la imagen como argumento de venta y de deseo. renders que trascienden la representación técnica para construir una narrativa visual en torno al objeto y su contexto.", info: { date: "2024", location: "remote", role: "ui design" } }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];
  const [navPositions, setNavPositions] = useState({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
  const [aboutPositions, setAboutPositions] = useState({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
  const [selectedProject, setSelectedProject] = useState(null);
  
  
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

  useEffect(() => { setCarouselIndex(0); setActiveSection(0); }, [selectedProject]);
  useEffect(() => { setCarouselIndex(0); }, [activeSection]);



  useEffect(() => {
    if (view === "home") setNavPositions({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
    if (view === "about") setAboutPositions({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
    if (view === "projects") {
      const positions = projects.map(() => ({
        top: Math.floor(Math.random() * 48 + 12) + "vh",
        left: Math.floor(Math.random() * 62 + 6) + "vw",
        rotation: "0deg",
        width: Math.floor(Math.random() * 70 + 100) + "px",
      }));
      setProjectPositions(positions);
    }
  }, [view]);




  const extractImageColors = (imgSrc, id) => {
    if (colorCacheRef.current[id]) { setGradientColors(colorCacheRef.current[id]); return; }
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 80; canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 80, 80);
      const pts = [[12,12],[68,12],[40,40],[12,68],[68,68]];
      const colors = pts.map(([x,y]) => { const d = ctx.getImageData(x,y,1,1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; });
      colorCacheRef.current[id] = colors;
      setGradientColors(colors);
    };
    img.src = imgSrc;
  };

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
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {!isMobile && <Crosshair color="#ffffff" showLines={view !== "home" && !imagesHovered} showArrow={false} label={view === "detail" && selectedProject ? (imagesHovered ? `${carouselArrow} ${(selectedProject.galleries[activeSection][carouselIndex])?.text || ''}` : selectedProject.title) : ''} />}

            {/* Info strip — fuera del motion.div de detalle para que mixBlendMode funcione */}
            {!isMobile && view === "detail" && selectedProject && (
              <div style={{ position: "fixed", top: "49vh", left: 0, right: 0, zIndex: 9998, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4vw", fontFamily: fontTitle, fontSize: "0.72rem", textTransform: "lowercase", letterSpacing: "0.06em", color: "#000", pointerEvents: "none" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center", whiteSpace: "nowrap" }}>
                  <span>{selectedProject.title}</span>
                  <span style={{ opacity: 0.5 }}>{selectedProject.info.date}</span>
                  <span style={{ opacity: 0.5 }}>{selectedProject.info.location}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", pointerEvents: "auto", cursor: "pointer" }}
                    onClick={() => { setFilterRole(selectedProject.info.role); setSelectedProject(null); setView("projects"); }}>
                    <span>{selectedProject.info.role}</span>
                    <span style={{ fontSize: "0.85rem" }}>↗</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", pointerEvents: "auto" }}>
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "0.5rem", letterSpacing: "0.12em", whiteSpace: "nowrap", pointerEvents: "none", color: "#000", opacity: 0.4 }}
                  >click and explore the sections</motion.span>
                  <div style={{ display: "flex", gap: "2rem", alignItems: "center", whiteSpace: "nowrap" }}>
                    {["project", "technical", "development"].map((s, i) => (
                      <span key={s} onClick={() => setActiveSection(i)}
                        style={{ opacity: activeSection === i ? 1 : 0.3, cursor: "pointer", transition: "opacity 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = activeSection === i ? 1 : 0.3}
                      >
                        {s}
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#000", opacity: activeSection === i ? 1 : 0, transition: "opacity 0.3s ease", flexShrink: 0 }} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NAV */}
            <nav>
              <AnimatePresence>
                {view === "home" ? (
                  <>
                    <motion.h1 onClick={() => setView("home")} animate={{ ...navPositions.giulia }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.75rem", textDecoration: "line-through", zIndex: 1000, cursor: "pointer" }}>giulia</motion.h1>
                    <motion.div onClick={() => setView("projects")} animate={{ ...navPositions.projects }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.72rem", zIndex: 1000, cursor: "pointer" }}>projects</motion.div>
                    <motion.div onClick={() => setView("about")} animate={{ ...navPositions.about }} whileHover={{ color: kleinBlue }} style={{ position: "fixed", fontFamily: fontTitle, fontSize: "0.72rem", zIndex: 1000, cursor: "pointer" }}>about</motion.div>
                  </>
                ) : (
                  <div style={{ fontFamily: fontTitle, fontSize: "0.72rem", textTransform: "lowercase" }}>
                    <div onClick={() => {setView("projects"); setSelectedProject(null); setFilterRole(null);}} style={{ position: "fixed", bottom: "4vh", left: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "projects" ? "line-through" : "none" }}>projects</div>
                    <div onClick={() => {setView("home"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", left: "50%", transform: "translateX(-50%)", zIndex: 1000, cursor: "pointer" }}>giulia</div>
                    <div onClick={() => {setView("about"); setSelectedProject(null);}} style={{ position: "fixed", bottom: "4vh", right: "4vw", zIndex: 1000, cursor: "pointer", textDecoration: view === "about" ? "line-through" : "none" }}>about</div>
                  </div>
                )}
              </AnimatePresence>
            </nav>



            <AnimatePresence mode="wait">
              {view === "home" && <motion.div key="home" style={{height: "100vh"}}><ImageTrail images={trailImages} /></motion.div>}

              {view === "projects" && (
                <motion.div key="projects" ref={containerRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

                  {/* Role filter menu */}
                  <div style={{ position: "fixed", top: "4vh", right: "4vw", zIndex: 600, fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase", textAlign: "right" }}>
                    <span
                      onClick={() => setShowRoleMenu(v => !v)}
                      style={{ cursor: "pointer", color: filterRole ? kleinBlue : "#000", letterSpacing: "0.08em" }}
                    >
                      {filterRole || "rol"}
                    </span>
                    <AnimatePresence>
                      {showRoleMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginTop: "0.9rem" }}
                        >
                          {[...new Set(projects.map(p => p.info.role))].map(role => (
                            <span
                              key={role}
                              onClick={() => { setFilterRole(role === filterRole ? null : role); setShowRoleMenu(false); }}
                              style={{ cursor: "pointer", color: filterRole === role ? kleinBlue : "#aaa", display: "block", whiteSpace: "nowrap" }}
                            >{role}</span>
                          ))}
                          {filterRole && (
                            <span onClick={() => { setFilterRole(null); setShowRoleMenu(false); }} style={{ cursor: "pointer", color: "#ccc", marginTop: "0.3rem" }}>× all</span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Gradient background on hover */}
                  <AnimatePresence>
                    {gradientColors && (
                      <motion.div
                        key="grad-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
                          background: `radial-gradient(ellipse at 25% 30%, ${gradientColors[0]} 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, ${gradientColors[1]} 0%, transparent 55%), radial-gradient(ellipse at 55% 65%, ${gradientColors[2]} 0%, transparent 50%), radial-gradient(ellipse at 15% 75%, ${gradientColors[3]} 0%, transparent 50%), radial-gradient(ellipse at 82% 78%, ${gradientColors[4]} 0%, transparent 50%)`,
                          filter: "blur(55px) saturate(1.6)",
                          opacity: 0.75,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Nube de imágenes */}
                  {projects.map((proj, index) => {
                    const isHidden = filterRole && proj.info.role !== filterRole;
                    return (
                      <motion.div
                        key={proj.id} drag dragConstraints={containerRef} onClick={() => openProject(proj)}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{
                          opacity: isHidden ? 0.07 : (hoveredProjectId !== null && hoveredProjectId !== proj.id ? 0.07 : 1),
                          scale: isHidden ? 0.9 : 1,
                          pointerEvents: isHidden ? "none" : "auto"
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 14, delay: index * 0.06, opacity: { duration: 0.35 } }}
                        whileHover={{ scale: 1.13, zIndex: 200 }}
                        onMouseEnter={() => { if (!isHidden) { setHoveredProjectId(proj.id); extractImageColors(proj.img, proj.id); } }}
                        onMouseLeave={() => { setHoveredProjectId(null); setGradientColors(null); }}
                        style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, width: projectPositions[index]?.width || "200px", cursor: "pointer", zIndex: 10 + index, willChange: "transform" }}
                      >
                        <img src={proj.img} className="proj-thumb" style={{ width: "100%", display: "block" }} />
                      </motion.div>
                    );
                  })}

                  {/* Título en hover */}
                  <AnimatePresence>
                    {hoveredProjectId && (
                      <motion.div
                        key={hoveredProjectId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        style={{ position: "fixed", top: "4vh", left: "50%", transform: "translateX(-50%)", fontFamily: fontTitle, fontSize: "1.1rem", color: "#000", textTransform: "lowercase", zIndex: 600, pointerEvents: "none", whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {projects.find(p => p.id === hoveredProjectId)?.title}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                    {/* Header */}
                    <div style={{ padding: "14vh 6vw 3vh" }}>
                      <h1 style={{ fontFamily: fontTitle, fontSize: "10vw", color: kleinBlue, lineHeight: "0.9", textTransform: "lowercase" }}>{selectedProject.title}</h1>
                      <div style={{ display: "flex", gap: "5vw", marginTop: "0.8rem", fontFamily: fontTitle, fontSize: "0.6rem", color: "#000", textTransform: "lowercase", flexWrap: "wrap", opacity: 0.6 }}>
                        <span>{selectedProject.info.role}</span>
                        <span>{selectedProject.info.location}</span>
                        <span>{selectedProject.info.date}</span>
                      </div>
                    </div>

                    {/* Section tabs */}
                    <div style={{ display: "flex", gap: "2rem", padding: "0 6vw 2vh", fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase" }}>
                      {["project", "technical", "development"].map((s, i) => (
                        <span key={s} onClick={() => setActiveSection(i)} style={{ cursor: "pointer", opacity: activeSection === i ? 1 : 0.3, transition: "opacity 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                          {s}
                          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#000", opacity: activeSection === i ? 1 : 0, transition: "opacity 0.3s ease" }} />
                        </span>
                      ))}
                    </div>

                    {/* Carousel */}
                    <AnimatePresence mode="wait">
                      <motion.div key={activeSection} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                        {selectedProject.galleries[activeSection].length === 0 ? (
                          <div style={{ height: "60vw", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontTitle, fontSize: "0.65rem", color: "#aaa" }}>coming soon</div>
                        ) : (
                          <div ref={carouselRef} style={{ width: "100vw", height: "70vw", overflow: "hidden" }}>
                            <motion.div
                              drag="x"
                              dragConstraints={carouselRef}
                              dragElastic={0.05}
                              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                              style={{ display: "flex", height: "100%", width: `${selectedProject.galleries[activeSection].length * 100}%` }}
                            >
                              {selectedProject.galleries[activeSection].map((item, i) => (
                                <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2vw 4vw" }}>
                                  {item.url.endsWith(".mp4") ? (
                                    <video src={item.url} autoPlay muted loop playsInline style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", pointerEvents: "none" }} />
                                  ) : (
                                    <img src={item.url} draggable={false} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", userSelect: "none" }} />
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Desc */}
                    <p style={{ fontFamily: fontBody, fontSize: "0.8rem", lineHeight: "1.6", opacity: 0.7, padding: "4vh 6vw 12vh" }}>{selectedProject.desc}</p>

                  </motion.div>
                ) : (
                  <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh", position: "relative" }}>

                    {/* Texto marquee arriba */}
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "6vh", overflow: "hidden", zIndex: 100, background: "white", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marqueeScroll 55s linear infinite" }}>
                        {[0,1,2,3].map(k => (
                          <span key={k} style={{ fontFamily: fontBody, fontSize: "0.65rem", color: "#555", paddingRight: "6vw" }}>
                            {selectedProject.desc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Carousel central — drag horizontal */}
                    <div
                      style={{ marginLeft: "4vw", marginRight: "4vw", marginTop: "6vh", height: "86vh", overflow: "hidden", position: "relative", cursor: "none" }}
                      onWheel={(e) => {
                        if (wheelCooldownRef.current) return;
                        wheelCooldownRef.current = true;
                        setTimeout(() => { wheelCooldownRef.current = false; }, 500);
                        const gallery = selectedProject.galleries[activeSection];
                        if (e.deltaY > 0) {
                          if (carouselIndex < gallery.length - 1) {
                            setCarouselIndex(i => i + 1);
                          } else if (activeSection < 2) {
                            setActiveSection(s => s + 1);
                          }
                        } else if (e.deltaY < 0) {
                          if (carouselIndex > 0) {
                            setCarouselIndex(i => i - 1);
                          } else if (activeSection > 0) {
                            setActiveSection(s => s - 1);
                          }
                        }
                      }}
                      onMouseMove={(e) => { setCarouselArrow(e.clientX < window.innerWidth * 0.54 ? '←' : '→'); }}
                      onMouseEnter={() => { setImagesHovered(true); }}
                      onClick={(e) => {
                        const goLeft = e.clientX < window.innerWidth * 0.54;
                        if (goLeft && carouselIndex > 0) setCarouselIndex(i => i - 1);
                        else if (!goLeft && carouselIndex < selectedProject.galleries[activeSection].length - 1) setCarouselIndex(i => i + 1);
                      }}
                      onPointerDown={(e) => { dragStartRef.current = e.clientX; }}
                      onPointerUp={(e) => {
                        const dx = e.clientX - dragStartRef.current;
                        if (dx < -50 && carouselIndex < selectedProject.galleries[activeSection].length - 1) setCarouselIndex(i => i + 1);
                        else if (dx > 50 && carouselIndex > 0) setCarouselIndex(i => i - 1);
                      }}
                      onMouseLeave={() => { setImagesHovered(false); setCarouselArrow('→'); }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSection}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                          style={{ position: "absolute", inset: 0 }}
                        >
                          {selectedProject.galleries[activeSection].length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: fontTitle, fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.08em" }}>coming soon</div>
                          ) : (
                            <motion.div
                              animate={{ x: `${-carouselIndex * (100 / selectedProject.galleries[activeSection].length)}%` }}
                              transition={{ type: "spring", stiffness: 300, damping: 35 }}
                              style={{ display: "flex", height: "100%", width: `${selectedProject.galleries[activeSection].length * 100}%`, userSelect: "none" }}
                            >
                              {selectedProject.galleries[activeSection].map((item, i) => (
                                <div key={i} style={{ width: `${100 / selectedProject.galleries[activeSection].length}%`, height: "100%", flexShrink: 0, overflow: "hidden" }}>
                                  {item.url.endsWith(".mp4") ? (
                                    <video src={item.url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }} />
                                  ) : (
                                    <img src={item.url} draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }} />
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
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