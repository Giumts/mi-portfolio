"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";
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
        filter: "blur(25px) saturate(130%)",
        willChange: "transform",
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

const KNOT_BASE = "M 15,75 C 15,38 38,10 58,32 C 78,54 76,78 56,66 C 36,54 22,30 46,18 C 70,6 92,32 92,65 C 92,76 80,80 68,74";
const KNOT_W1  = "M 17,73 C 17,40 40,12 56,34 C 72,56 74,76 54,64 C 34,52 24,32 48,20 C 72,8 90,34 90,63 C 90,74 78,78 66,72";
const KNOT_W2  = "M 13,77 C 13,36 36,8 60,30 C 84,52 78,80 58,68 C 38,56 20,28 44,16 C 68,4 94,30 94,67 C 94,78 82,82 70,76";
const KNOT_OUT = "M 50,0 C 50,20 50,40 50,60 C 50,40 50,20 50,0 C 50,20 50,40 50,60 C 50,40 50,20 50,0 C 50,20 50,40 50,60";

const KnotThread = ({ onReveal }) => {
  const svgRef  = useRef(null);
  const pathRef = useRef(null);
  const idleTL  = useRef(null);
  const timer   = useRef(null);
  const done    = useRef(false);

  useEffect(() => {
    if (!pathRef.current) return;
    idleTL.current = gsap.timeline({ repeat: -1 })
      .to(pathRef.current, { duration: 1.6, attr: { d: KNOT_W1 }, ease: "sine.inOut" })
      .to(pathRef.current, { duration: 1.3, attr: { d: KNOT_W2 }, ease: "sine.inOut" })
      .to(pathRef.current, { duration: 1.8, attr: { d: KNOT_BASE }, ease: "sine.inOut" });
    return () => { idleTL.current?.kill(); clearTimeout(timer.current); };
  }, []);

  const distort = (e) => {
    if (done.current) return;
    const r  = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 22;
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 16;
    idleTL.current?.pause();
    gsap.to(pathRef.current, { duration: 0.12, ease: "power2.out", attr: { d:
      `M ${15+dx*.3},${75+dy*.2} C ${15+dx*.4},${38+dy*.3} ${38+dx*.2},${10+dy*.4} ${58+dx*.3},${32+dy*.3} C ${78+dx*.2},${54+dy*.2} ${76+dx*.2},${78+dy*.2} ${56+dx*.3},${66+dy*.2} C ${36+dx*.4},${54+dy*.3} ${22+dx*.3},${30+dy*.4} ${46+dx*.2},${18+dy*.3} C ${70+dx*.2},${6+dy*.2} ${92+dx*.2},${32+dy*.2} ${92+dx*.2},${65+dy*.2} C ${92+dx*.1},${76+dy*.1} ${80+dx*.1},${80+dy*.1} ${68+dx*.1},${74+dy*.1}`
    }});
  };

  const onEnter = () => {
    if (done.current) return;
    timer.current = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      idleTL.current?.kill();
      gsap.to(pathRef.current, { attr: { d: KNOT_OUT }, duration: 0.55, ease: "power2.out" });
      gsap.to(svgRef.current,  { opacity: 0, duration: 0.4, delay: 0.25, onComplete: onReveal });
    }, 350);
  };

  const onLeave = () => {
    if (done.current) return;
    clearTimeout(timer.current);
    gsap.to(pathRef.current, { duration: 0.45, attr: { d: KNOT_BASE }, ease: "power2.out",
      onComplete: () => idleTL.current?.resume() });
  };

  return (
    <div onMouseMove={distort} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ marginTop: "4rem", cursor: "crosshair", padding: "1rem" }}>
      <svg ref={svgRef} width="140" height="115" viewBox="0 0 100 90"
        style={{ overflow: "visible", display: "block", opacity: 0.45 }}>
        <path ref={pathRef} d={KNOT_BASE} stroke="#002FA7" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
};

export default function Home() {
  const [view, setView] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false); // Para evitar errores de hidratación
  const [projectPositions, setProjectPositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorColor, setCursorColor] = useState("#000000");
  const [detailInfoPositions, setDetailInfoPositions] = useState({});
  const [detailShowImages, setDetailShowImages] = useState(false);
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
      const positions = projects.map(() => ({ top: Math.floor(Math.random() * 60 + 15) + "vh", left: Math.floor(Math.random() * 70 + 10) + "vw", rotation: (Math.random() * 10 - 5) + "deg" }));
      setProjectPositions(positions);
    }
  }, [view]);

  const openProject = (proj) => {
    const r = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
    setDetailInfoPositions({
      role:     { top: `${r(5,  14)}vh`, right: `${r(1, 8)}vw`, rotate: `${r(-3, 3)}deg` },
      location: { top: `${r(40, 58)}vh`, right: `${r(1, 8)}vw`, rotate: `${r(-3, 3)}deg` },
      date:     { top: `${r(74, 88)}vh`, right: `${r(1, 8)}vw`, rotate: `${r(-3, 3)}deg` },
    });
    setSelectedProject(proj);
    setDetailShowImages(false);
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
        .falling-text { cursor: crosshair; }
        .falling-text, .falling-text * { color: #222; }
        .falling-text .text-normal { opacity: 1; transition: opacity 0.08s, transform 0.08s; }
        .falling-text .text-split  { opacity: 0; transition: opacity 0.08s; }
        .falling-text:hover .text-normal { opacity: 0; transform: scaleX(1.18) skewX(-8deg); }
        .falling-text:hover .text-split  { opacity: 1; }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {!isMobile && <Crosshair color="#ffffff" showLines={view !== "home"} />}
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
                  <MouseShadowEffect mouseX={mouseX} mouseY={mouseY} />
                  {projects.map((proj, index) => (
                    <motion.div
                      key={proj.id} drag dragConstraints={containerRef} onClick={() => openProject(proj)}
                      whileHover={{ scale: 1.05 }}
                      style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, rotate: projectPositions[index]?.rotation, width: "150px", cursor: "pointer", zIndex: 10, willChange: "transform" }}>
                      <img src={proj.img} className="proj-thumb" style={{ width: "100%" }} />
                      <p style={{ fontFamily: fontBody, marginTop: "10px", fontSize: "0.7rem" }}>{proj.title}</p>
                    </motion.div>
                  ))}
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
                    <motion.p key={selectedProject.title + "-role"} initial={{ scale: 1.8, opacity: 0, top: "50vh", right: "2vw" }} animate={{ scale: 1, opacity: 1, top: detailInfoPositions.role?.top, right: detailInfoPositions.role?.right }} transition={{ scale: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0 }, top: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0 }, right: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0 }, opacity: { duration: 1.2, ease: "easeOut", delay: 0 } }} style={{ position: "fixed", rotate: detailInfoPositions.role?.rotate, zIndex: 500, fontFamily: fontTitle, fontSize: "0.9rem", textTransform: "lowercase", color: "#ffffff", mixBlendMode: "difference", pointerEvents: "none" }}>{selectedProject.info.role}</motion.p>
                    <motion.p key={selectedProject.title + "-location"} initial={{ scale: 1.8, opacity: 0, top: "50vh", right: "2vw" }} animate={{ scale: 1, opacity: 1, top: detailInfoPositions.location?.top, right: detailInfoPositions.location?.right }} transition={{ scale: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.2 }, top: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.2 }, right: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.2 }, opacity: { duration: 1.2, ease: "easeOut", delay: 0.2 } }} style={{ position: "fixed", rotate: detailInfoPositions.location?.rotate, zIndex: 500, fontFamily: fontTitle, fontSize: "0.9rem", textTransform: "lowercase", color: "#ffffff", mixBlendMode: "difference", pointerEvents: "none" }}>{selectedProject.info.location}</motion.p>
                    <motion.p key={selectedProject.title + "-date"} initial={{ scale: 1.8, opacity: 0, top: "50vh", right: "2vw" }} animate={{ scale: 1, opacity: 1, top: detailInfoPositions.date?.top, right: detailInfoPositions.date?.right }} transition={{ scale: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.38 }, top: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.38 }, right: { type: "spring", stiffness: 35, damping: 18, mass: 1.2, delay: 0.38 }, opacity: { duration: 1.2, ease: "easeOut", delay: 0.38 } }} style={{ position: "fixed", rotate: detailInfoPositions.date?.rotate, zIndex: 500, fontFamily: fontTitle, fontSize: "0.9rem", textTransform: "lowercase", color: "#ffffff", mixBlendMode: "difference", pointerEvents: "none" }}>{selectedProject.info.date}</motion.p>

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
                            <div key={j} className="falling-text" style={{ position: "absolute", top: 0, left: fc.left, rotate: fc.rotate, animation: `floatDown 130s linear ${fc.delay} infinite`, pointerEvents: "auto" }}>
                              <div className="text-normal" style={{ fontFamily: "'Almendra Display', serif", fontSize: "1.1rem", maxWidth: "14vw" }}>
                                {text}
                              </div>
                              <div className="text-split" style={{ position: "absolute", top: 0, left: "-3vw", display: "flex", gap: "2.5vw" }}>
                                <div style={{ fontFamily: "'Almendra Display', serif", fontSize: "1rem",   maxWidth: "3.5vw", rotate: "-4deg" }}>{text}</div>
                                <div style={{ fontFamily: "'Almendra Display', serif", fontSize: "0.9rem", maxWidth: "3vw",   rotate: "2deg",  opacity: 0.75, marginTop: "1.5rem" }}>{text}</div>
                                <div style={{ fontFamily: "'Almendra Display', serif", fontSize: "1.1rem", maxWidth: "4vw",   rotate: "-1deg", opacity: 0.9 }}>{text}</div>
                                <div style={{ fontFamily: "'Almendra Display', serif", fontSize: "0.85rem",maxWidth: "2.5vw", rotate: "5deg",  opacity: 0.5, marginTop: "2.5rem" }}>{text}</div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </motion.div>

                    {/* Header centrado */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20vh 10vw 0" }}>
                      <span style={{ fontFamily: fontTitle, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.3, marginBottom: "3rem" }}>
                        {String(selectedProject.id).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                      </span>
                      <h1 style={{ fontFamily: fontTitle, fontSize: "9vw", color: kleinBlue, lineHeight: "0.85", letterSpacing: "-0.025em", maxWidth: "80vw" }}>
                        {selectedProject.title}
                      </h1>
                      <p style={{ fontFamily: fontBody, fontSize: "0.75rem", maxWidth: "36vw", lineHeight: "1.8", opacity: 0.55, marginTop: "2.5rem" }}>
                        {selectedProject.desc}
                      </p>

                      {/* Hilo enredado — click para revelar imágenes */}
                      {!detailShowImages && (
                        <KnotThread onReveal={() => setDetailShowImages(true)} />
                      )}
                    </div>

                    {/* Imágenes en scroll conectadas por hilos */}
                    <AnimatePresence>
                      {detailShowImages && (
                        <div style={{ width: "80vw", margin: "0 auto", display: "flex", flexDirection: "column", paddingBottom: "25vh" }}>
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
                              const x1 = 50;
                              const x2 = 50;
                              const mx = 50;
                              const delay = i * 0.45;
                              return (
                                <Fragment key={i}>
                                  {/* hilo conector */}
                                  <motion.svg
                                    width="100%" height={i === 0 ? "10vh" : "18vh"}
                                    viewBox="0 0 100 100" preserveAspectRatio="none"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay }}
                                    style={{ display: "block", overflow: "visible", cursor: "crosshair" }}
                                    onMouseEnter={(e) => {
                                      const path = e.currentTarget.querySelector("path");
                                      if (!path) return;
                                      gsap.killTweensOf(path);
                                      gsap.to(path, { keyframes: [
                                        { attr: { d: `M ${x1},0 Q ${mx + 16},50 ${x2},100` }, duration: 0.07 },
                                        { attr: { d: `M ${x1},0 Q ${mx - 16},50 ${x2},100` }, duration: 0.07 },
                                        { attr: { d: `M ${x1},0 Q ${mx + 10},50 ${x2},100` }, duration: 0.07 },
                                        { attr: { d: `M ${x1},0 Q ${mx - 7},50 ${x2},100`  }, duration: 0.07 },
                                        { attr: { d: `M ${x1},0 Q ${mx},50 ${x2},100`      }, duration: 0.07 },
                                      ]});
                                    }}
                                  >
                                    <path d={`M ${x1},0 Q ${mx},50 ${x2},100`} stroke="#002FA7" strokeWidth="1" fill="none" opacity="0.5" vectorEffect="non-scaling-stroke" />
                                  </motion.svg>
                                  {/* imagen */}
                                  <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: [30, 0, -5, 0] }}
                                    transition={{ opacity: { duration: 0.6, delay: delay + 0.15 }, y: { duration: 0.8, ease: "easeOut", delay: delay + 0.15, times: [0, 0.7, 0.85, 1] } }}
                                    onMouseEnter={() => { setHoveredIndex(i); setCursorColor("#ffffff"); }}
                                    onMouseLeave={() => { setHoveredIndex(null); setCursorColor("#000000"); }}
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
                      )}
                    </AnimatePresence>
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