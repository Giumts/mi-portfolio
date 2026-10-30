"use client";
import { useState, useEffect, useRef } from "react";
import ImageTrail from "./ImageTrail";
import Crosshair from "./Crosshair";
import { motion, AnimatePresence } from "framer-motion";


// Versiones optimizadas (WebP) generadas en /public/opt. "full" para ver grande, "thumb" para miniaturas.
// conserva la extensión original (04.jpg -> 04.jpg.webp) para que dos fotos con el mismo nombre no se pisen
const opt = (url, size = "full") => (/\.(jpe?g|png)$/i.test(url) ? `/opt/${size}${url}.webp` : url);

// PDFs del apartado about (páginas renderizadas en /public/pdf_previews)
const DOCS = [
  { key: "collective", label: "collective ephemeral", pdf: "/collective%20ephemeral.pdf", pages: 18, start: 2, cover: 3 },
  { key: "photos", label: "project in photos", pdf: "/Projects_foto.pdf", pages: 23, start: 1, cover: 1 },
];
// páginas del visor: primero la portada, luego el resto en orden
const docRest = (doc) => Array.from({ length: doc.pages - doc.start + 1 }, (_, k) => doc.start + k).filter(n => n !== doc.cover);
const docPage = (doc, n) => `/pdf_previews/${doc.key}/${String(n).padStart(2, "0")}.jpg`;

// About: formas de la línea central (misma estructura para poder animar entre ellas)
const LINE_PATHS = [
  "M10 0 C 11.5 90, 8.6 170, 10.4 260 S 11.2 420, 9.3 520 S 10.9 690, 10.2 780 S 8.9 920, 10.3 1000",
  "M10 0 C 8.8 110, 11.3 190, 9.6 280 S 8.7 440, 10.8 540 S 9.2 700, 9.7 800 S 11.1 930, 9.8 1000",
  "M10 0 C 10.9 70, 9.1 160, 10.9 250 S 10.2 400, 9.0 500 S 11.4 670, 10.6 770 S 9.4 900, 10.1 1000",
];

// About: líneas de libro abierto (viewBox 1000x1000, el lomo está en x=500)
const BOOK_PATHS = (() => {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const op = 0.55 - i * 0.11;
    const o = i * 3.2;
    // borde superior de las hojas, del lomo hacia fuera (izquierda y derecha)
    out.push({ path: `M500 ${26 + o} C 430 ${8 + o}, 200 ${4 + o}, 0 ${10 + o}`, opacity: op, delay: i * 0.25 });
    out.push({ path: `M500 ${26 + o} C 570 ${8 + o}, 800 ${4 + o}, 1000 ${10 + o}`, opacity: op, delay: i * 0.25 });
    // borde inferior
    out.push({ path: `M500 ${974 - o} C 430 ${992 - o}, 200 ${996 - o}, 0 ${990 - o}`, opacity: op, delay: 0.6 + i * 0.25 });
    out.push({ path: `M500 ${974 - o} C 570 ${992 - o}, 800 ${996 - o}, 1000 ${990 - o}`, opacity: op, delay: 0.6 + i * 0.25 });
    // canto de las páginas en los extremos
    const x = 3 + i * 2.2;
    out.push({ path: `M${x} ${12 + o} L${x + 0.4} ${988 - o}`, opacity: op * 0.8, delay: 1.2 + i * 0.2 });
    out.push({ path: `M${1000 - x} ${12 + o} L${1000 - x - 0.4} ${988 - o}`, opacity: op * 0.8, delay: 1.2 + i * 0.2 });
  }
  return out;
})();

// About: huecos blancos del libro donde aparece cada foto
const PREVIEW_SPOTS = {
  collective: { top: "20vh", left: "21vw" },
  photos: { top: "22vh", left: "64vw" },
  cv: { top: "64vh", left: "69vw" },
};

// Home: texto que se descubre "rascando" con el ratón.
// Una máscara invisible decide qué partes de la frase se ven; al pasar el ratón se van pintando.
const ScratchText = ({ children, className, brush = 26 }) => {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);
  const lastRef = useRef(null);
  const frameRef = useRef(0);

  const applyMask = () => {
    frameRef.current = 0;
    if (!textRef.current || !maskRef.current) return;
    const url = `url(${maskRef.current.toDataURL()})`;
    textRef.current.style.maskImage = url;
    textRef.current.style.webkitMaskImage = url;
  };
  const scheduleMask = () => { if (!frameRef.current) frameRef.current = requestAnimationFrame(applyMask); };

  useEffect(() => {
    const wrap = wrapRef.current;
    const mask = document.createElement("canvas");
    maskRef.current = mask;
    const cover = () => {
      const { width, height } = wrap.getBoundingClientRect();
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const ctx = mask.getContext("2d");
      ctx.clearRect(0, 0, mask.width, mask.height);
      ctx.fillStyle = "rgba(0,0,0,0.07)"; // la frase apenas se intuye
      ctx.fillRect(0, 0, mask.width, mask.height);
      scheduleMask();
    };
    cover();
    const ro = new ResizeObserver(cover);
    ro.observe(wrap);
    return () => { ro.disconnect(); cancelAnimationFrame(frameRef.current); frameRef.current = 0; };
  }, []);

  const scratchAt = (x, y) => {
    const ctx = maskRef.current.getContext("2d");
    const r = brush;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(0,0,0,0.95)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const last = lastRef.current;
    // rellena el trazo entre dos movimientos para que no queden huecos
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      const steps = Math.max(1, Math.floor(dist / 6));
      for (let i = 1; i <= steps; i++) scratchAt(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps);
    } else {
      scratchAt(x, y);
    }
    lastRef.current = { x, y };
    scheduleMask();
  };

  return (
    <div ref={wrapRef} className={className} style={{ position: "absolute" }} onPointerMove={onMove} onPointerLeave={() => { lastRef.current = null; }}>
      <div ref={textRef} style={{ maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}>
        {children}
      </div>
    </div>
  );
};

// About: texto que aparece palabra por palabra
const Words = ({ text, delay = 0, step = 0.012 }) =>
  text.split(" ").map((w, i, arr) => (
    <span key={i}>
      <motion.span
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: delay + i * step, duration: 0.5, ease: "easeOut" }}
        style={{ display: "inline-block", textIndent: 0 }}
      >{w}</motion.span>{i < arr.length - 1 ? " " : ""}
    </span>
  ));

// Home: texto que se escribe letra a letra, con cursor fino
const TypeLine = ({ text, delay = 0, speed = 55 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let t;
    const tick = (i) => {
      setN(i);
      if (i < text.length) {
        // ritmo algo irregular, como alguien escribiendo
        const ch = text[i - 1];
        const pause = ch === "," ? 260 : ch === " " ? speed * 1.6 : speed * (0.6 + Math.random() * 0.9);
        t = setTimeout(() => tick(i + 1), pause);
      }
    };
    t = setTimeout(() => tick(1), delay);
    return () => clearTimeout(t);
  }, [text, delay, speed]);
  return (
    <>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <span className="type-caret" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </>
  );
};

// About: enlace con paréntesis ( ) / (*)
const Bracket = ({ active, children, onClick, onEnter, onLeave, href, download }) => {
  const Tag = href ? "a" : "span";
  return (
    <Tag
      className={`brk${active ? " brk-on" : ""}`}
      href={href}
      download={download}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="brk-box">(<span className="brk-dot">*</span>)</span> {children}
    </Tag>
  );
};

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
          fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", fontWeight: 300, fontSize: "0.85rem", letterSpacing: "0.01em",
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
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [filterRole, setFilterRole] = useState(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [locationHovered, setLocationHovered] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryPositions, setGalleryPositions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const dragStartRef = useRef(0);
  const dragAreaRef = useRef(null);
  // tras la entrada escalonada de projects, los cambios de filtro son inmediatos
  const [projectsIntroDone, setProjectsIntroDone] = useState(false);
  useEffect(() => {
    if (view !== "projects") { setProjectsIntroDone(false); return; }
    const t = setTimeout(() => setProjectsIntroDone(true), 1600);
    return () => clearTimeout(t);
  }, [view]);
  const dragMovedRef = useRef(false);
  // ventana de texto del proyecto: se abre al rozar la frase de arriba
  const descCloseRef = useRef(null);
  const openDesc = () => { clearTimeout(descCloseRef.current); setShowFullDesc(true); };
  const closeDescSoon = () => { clearTimeout(descCloseRef.current); descCloseRef.current = setTimeout(() => setShowFullDesc(false), 180); };
  const wheelCooldownRef = useRef(false);
  const colorCacheRef = useRef({});
  const [gradientColors, setGradientColors] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [openDoc, setOpenDoc] = useState(null);
  const [aboutPreview, setAboutPreview] = useState(null);
  const [projNavPos, setProjNavPos] = useState({ giulia: { top: "86vh", left: "12vw" }, projects: { top: "87vh", left: "32vw" }, categories: { top: "86vh", left: "54vw" }, about: { top: "85vh", left: "78vw" } });
  const [aboutNavPos, setAboutNavPos] = useState({ giulia: { top: "72vh", left: "20vw" }, about: { top: "26vh", left: "55vw" }, projects: { top: "74vh", left: "57vw" } });

  useEffect(() => {
    if (!openDoc) return;
    const onKey = (e) => { if (e.key === "Escape") setOpenDoc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDoc]);

  // Galerías — project / technical / development por proyecto
  const g1p = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }];
  const g1t = [{ url: "/fotos_detalle/24_t01.png", text: "tech 01" }, { url: "/fotos_detalle/24_t02.png", text: "tech 02" }, { url: "/fotos_detalle/24_t03.png", text: "tech 03" }, { url: "/fotos_detalle/24_t04.jpg", text: "tech 04" }, { url: "/fotos_detalle/24_t05.jpg", text: "tech 05" }, { url: "/fotos_detalle/24_t06.png", text: "tech 06" }, { url: "/fotos_detalle/24_t07.png", text: "tech 07" }, { url: "/fotos_detalle/24_t08.png", text: "tech 08" }, { url: "/fotos_detalle/24_t10.jpg", text: "tech 10" }];
  const g1d = [];
  const g2p = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }];
  const g2t = [{ url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_9.jpg", text: "vuelo 09" }, { url: "/fotos_detalle/aria_10.jpg", text: "vuelo 10" }, { url: "/fotos_detalle/aria_11.jpg", text: "vuelo 11" }, { url: "/fotos_detalle/aria_12.jpg", text: "vuelo 12" }];
  const g2d = [{ url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_6b.png", text: "vuelo 06b" }];
  const g3p = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.jpg", text: "fail 05" }, { url: "/fotos_detalle/bf_6.jpg", text: "fail 06" }, { url: "/fotos_detalle/bf_7.jpg", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const g3d = [{ url: "/fotos_detalle/bf_p01.png", text: "dev 01" }, { url: "/fotos_detalle/bf_p02.png", text: "dev 02" }, { url: "/fotos_detalle/bf_p03.png", text: "dev 03" }, { url: "/fotos_detalle/bf_p04.jpg", text: "dev 04" }, { url: "/fotos_detalle/bf_p05.png", text: "dev 05" }, { url: "/fotos_detalle/bf_p06.jpg", text: "dev 06" }, { url: "/fotos_detalle/bf_p07.png", text: "dev 07" }, { url: "/fotos_detalle/bf_p08.png", text: "dev 08" }];
  const g3t = [{ url: "/fotos_detalle/bf_T01.png", text: "tech 01" }, { url: "/fotos_detalle/bf_T02.png", text: "tech 02" }, { url: "/fotos_detalle/bf_T03.png", text: "tech 03" }, { url: "/fotos_detalle/bf_T04.png", text: "tech 04" }, { url: "/fotos_detalle/bf_T05.png", text: "tech 05" }, { url: "/fotos_detalle/bf_T06.png", text: "tech 06" }, { url: "/fotos_detalle/bf_T07.png", text: "tech 07" }];
  const g4p = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }, { url: "/fotos_detalle/led_7.jpg", text: "light 07" }, { url: "/fotos_detalle/led_8.jpg", text: "light 08" }, { url: "/fotos_detalle/led_9.jpg", text: "light 09" }];
  const g4t = [{ url: "/fotos_detalle/led_9.png", text: "light t09" }, { url: "/fotos_detalle/led_10.png", text: "light t10" }, { url: "/fotos_detalle/led_11.png", text: "light t11" }, { url: "/fotos_detalle/led_12.png", text: "light t12" }, { url: "/fotos_detalle/led_13.png", text: "light t13" }];
  const g4d = [{ url: "/fotos_detalle/led_5.jpg", text: "light d05" }, { url: "/fotos_detalle/led_6.png", text: "light d06" }];
  const g5p = [{ url: "/fotos_detalle/nysm_p01.jpg", text: "nysm 01" }, { url: "/fotos_detalle/nysm_p02.jpg", text: "nysm 02" }, { url: "/fotos_detalle/nysm_p03.jpg", text: "nysm 03" }, { url: "/fotos_detalle/nysm_p04.jpg", text: "nysm 04" }, { url: "/fotos_detalle/nysm_p05.jpg", text: "nysm 05" }, { url: "/fotos_detalle/nysm_p06.jpg", text: "nysm 06" }, { url: "/fotos_detalle/nysm_p07.jpg", text: "nysm 07" }, { url: "/fotos_detalle/nysm_p08.jpg", text: "nysm 08" }, { url: "/fotos_detalle/nysm_p09.jpg", text: "nysm 09" }, { url: "/fotos_detalle/nysm_p10.jpg", text: "nysm 10" }];
  const g5k = [{ url: "/fotos_detalle/nysm_k01.jpg", text: "kit 01" }, { url: "/fotos_detalle/nysm_k02.jpg", text: "kit 02" }, { url: "/fotos_detalle/nysm_k03.jpg", text: "kit 03" }, { url: "/fotos_detalle/nysm_k04.jpg", text: "kit 04" }, { url: "/fotos_detalle/nysm_k05.jpg", text: "kit 05" }, { url: "/fotos_detalle/nysm_k06.jpg", text: "kit 06" }, { url: "/fotos_detalle/nysm_k07.jpg", text: "kit 07" }, { url: "/fotos_detalle/nysm_k08.jpg", text: "kit 08" }, { url: "/fotos_detalle/nysm_k09.jpg", text: "kit 09" }, { url: "/fotos_detalle/nysm_k10.jpg", text: "kit 10" }, { url: "/fotos_detalle/nysm_k11.jpg", text: "kit 11" }, { url: "/fotos_detalle/nysm_k12.jpg", text: "kit 12" }];
  const g5e = [{ url: "/fotos_detalle/nysm_e01.jpg", text: "exh 01" }, { url: "/fotos_detalle/nysm_e02.jpg", text: "exh 02" }, { url: "/fotos_detalle/nysm_e03.jpg", text: "exh 03" }, { url: "/fotos_detalle/nysm_e04.jpg", text: "exh 04" }, { url: "/fotos_detalle/nysm_e05.jpg", text: "exh 05" }, { url: "/fotos_detalle/nysm_e06.jpg", text: "exh 06" }, { url: "/fotos_detalle/nysm_e07.jpeg", text: "exh 07" }, { url: "/fotos_detalle/nysm_e08.jpeg", text: "exh 08" }, { url: "/fotos_detalle/nysm_e09.jpeg", text: "exh 09" }, { url: "/fotos_detalle/nysm_e10.jpeg", text: "exh 10" }, { url: "/fotos_detalle/nysm_e11.jpeg", text: "exh 11" }];
  const g6p = [{ url: "/fotos_detalle/rs_p01.jpg", text: "rise 01" }, { url: "/fotos_detalle/rs_p02.jpg", text: "rise 02" }, { url: "/fotos_detalle/rs_p03.jpg", text: "rise 03" }, { url: "/fotos_detalle/rs_p04.jpg", text: "rise 04" }, { url: "/fotos_detalle/rs_p05.JPG", text: "rise 05" }, { url: "/fotos_detalle/rs_p06.JPG", text: "rise 06" }, { url: "/fotos_detalle/rs_p07.JPG", text: "rise 07" }, { url: "/fotos_detalle/rs_p08.JPG", text: "rise 08" }];
  const g6t = [{ url: "/fotos_detalle/rs_t01.png", text: "tech 01" }, { url: "/fotos_detalle/rs_t02.png", text: "tech 02" }, { url: "/fotos_detalle/rs_t03.png", text: "tech 03" }, { url: "/fotos_detalle/rs_t04.png", text: "tech 04" }, { url: "/fotos_detalle/rs_t05.png", text: "tech 05" }, { url: "/fotos_detalle/rs_t06.png", text: "tech 06" }, { url: "/fotos_detalle/rs_t07.png", text: "tech 07" }, { url: "/fotos_detalle/rs_t08.png", text: "tech 08" }, { url: "/fotos_detalle/rs_t09.png", text: "tech 09" }, { url: "/fotos_detalle/rs_t10.png", text: "tech 10" }, { url: "/fotos_detalle/rs_t11.png", text: "tech 11" }, { url: "/fotos_detalle/rs_t12.png", text: "tech 12" }, { url: "/fotos_detalle/rs_t13.png", text: "tech 13" }, { url: "/fotos_detalle/rs_t14.png", text: "tech 14" }, { url: "/fotos_detalle/rs_t15.png", text: "tech 15" }, { url: "/fotos_detalle/rs_t16.png", text: "tech 16" }, { url: "/fotos_detalle/rs_t17.png", text: "tech 17" }, { url: "/fotos_detalle/rs_t18.png", text: "tech 18" }, { url: "/fotos_detalle/rs_t19.png", text: "tech 19" }, { url: "/fotos_detalle/rs_t20.png", text: "tech 20" }, { url: "/fotos_detalle/rs_t21.png", text: "tech 21" }, { url: "/fotos_detalle/rs_t22.png", text: "tech 22" }, { url: "/fotos_detalle/rs_t23.png", text: "tech 23" }, { url: "/fotos_detalle/rs_t24.png", text: "tech 24" }, { url: "/fotos_detalle/rs_t25.png", text: "tech 25" }, { url: "/fotos_detalle/rs_t26.png", text: "tech 26" }, { url: "/fotos_detalle/rs_t27.png", text: "tech 27" }, { url: "/fotos_detalle/rs_t28.png", text: "tech 28" }];
  const g6d = [{ url: "/fotos_detalle/rs_d03.png", text: "dev 03" }, { url: "/fotos_detalle/rs_d04.png", text: "dev 04" }, { url: "/fotos_detalle/rs_d05.png", text: "dev 05" }, { url: "/fotos_detalle/rs_d06.png", text: "dev 06" }, { url: "/fotos_detalle/rs_d07.png", text: "dev 07" }, { url: "/fotos_detalle/rs_d08.png", text: "dev 08" }, { url: "/fotos_detalle/rs_d09.png", text: "dev 09" }, { url: "/fotos_detalle/rs_d10.png", text: "dev 10" }, { url: "/fotos_detalle/rs_d11.png", text: "dev 11" }, { url: "/fotos_detalle/rs_d12.png", text: "dev 12" }, { url: "/fotos_detalle/rs_d13.png", text: "dev 13" }, { url: "/fotos_detalle/rs_d14.png", text: "dev 14" }];
  const g7p = [{ url: "/fotos_detalle/ss_p01.jpg", text: "ss 01" }, { url: "/fotos_detalle/ss_p04.JPG", text: "ss 04" }, { url: "/fotos_detalle/ss_p05.JPG", text: "ss 05" }, { url: "/fotos_detalle/ss_p06.jpg", text: "ss 06" }, { url: "/fotos_detalle/ss_p07.jpg", text: "ss 07" }, { url: "/fotos_detalle/ss_p8.jpg", text: "ss 08" }, { url: "/fotos_detalle/ss_p09.jpg", text: "ss 09" }];
  const g7t = [{ url: "/fotos_detalle/ss_da.png", text: "fotomontajes iniciales" }, { url: "/fotos_detalle/ss_db.png", text: "fotomontajes iniciales" }, { url: "/fotos_detalle/ss_dc.png", text: "fotomontajes iniciales" }, { url: "/fotos_detalle/ss_t01.png", text: "ss t01" }, { url: "/fotos_detalle/ss_t02.png", text: "ss t02" }, { url: "/fotos_detalle/ss_t03.png", text: "ss t03" }, { url: "/fotos_detalle/ss_t04.png", text: "ss t04" }, { url: "/fotos_detalle/ss_t05.png", text: "ss t05" }, { url: "/fotos_detalle/ss_t06.png", text: "ss t06" }, { url: "/fotos_detalle/ss_t07.png", text: "ss t07" }, { url: "/fotos_detalle/ss_t08.png", text: "ss t08" }, { url: "/fotos_detalle/ss_t10.png", text: "ss t10" }, { url: "/fotos_detalle/ss_t019.png", text: "ss t19" }];
  const g7d = [{ url: "/fotos_detalle/ss_d01.JPG", text: "ss d01" }, { url: "/fotos_detalle/ss_d02.JPG", text: "ss d02" }, { url: "/fotos_detalle/ss_d03.JPG", text: "ss d03" }, { url: "/fotos_detalle/ss_d04.JPG", text: "ss d04" }, { url: "/fotos_detalle/ss_d05.jpg", text: "ss d05" }, { url: "/fotos_detalle/ss_d06.JPG", text: "ss d06" }, { url: "/fotos_detalle/ss_d07.png", text: "ss d07" }, { url: "/fotos_detalle/ss_d08.png", text: "ss d08" }];
  const g8p = [{ url: "/fotos_detalle/02.jpg", text: "vora 02" }, { url: "/fotos_detalle/04.jpg", text: "vora 04" }, { url: "/fotos_detalle/05.jpg", text: "vora 05" }, { url: "/fotos_detalle/06.jpg", text: "vora 06" }, { url: "/fotos_detalle/09.jpg", text: "vora 09" }, { url: "/fotos_detalle/Portada_vora.jpg", text: "vora portada" }];
  const g8t = [{ url: "/fotos_detalle/08.jpg", text: "vora 08" }];
  const g11p = [{ url: "/fotos_detalle/eu_p_01.png", text: "eu 01" }, { url: "/fotos_detalle/eu_p_02.png", text: "eu 02" }, { url: "/fotos_detalle/eu_p_03.png", text: "eu 03" }, { url: "/fotos_detalle/eu_p_04.png", text: "eu 04" }, { url: "/fotos_detalle/eu_p_05.png", text: "eu 05" }, { url: "/fotos_detalle/eu_p_06.png", text: "eu 06" }, { url: "/fotos_detalle/eu_p_07.png", text: "eu 07" }, { url: "/fotos_detalle/eu_p_08.png", text: "eu 08" }, { url: "/fotos_detalle/eu_p_09.png", text: "eu 09" }, { url: "/fotos_detalle/eu_p_10.png", text: "eu 10" }, { url: "/fotos_detalle/eu_p_11.png", text: "eu 11" }, { url: "/fotos_detalle/eu_p_12.png", text: "eu 12" }, { url: "/fotos_detalle/eu_p_13.png", text: "eu 13" }, { url: "/fotos_detalle/eu_p_14.png", text: "eu 14" }, { url: "/fotos_detalle/eu_p_15.png", text: "eu 15" }, { url: "/fotos_detalle/eu_p_16.png", text: "eu 16" }];
  const g11t = [{ url: "/fotos_detalle/eu_c_03.png", text: "eu t03" }, { url: "/fotos_detalle/eu_c_04.png", text: "eu t04" }, { url: "/fotos_detalle/eu_c_06.png", text: "eu t06" }];
  const g11d = [{ url: "/fotos_detalle/eu_o_01.JPG", text: "eu d01" }, { url: "/fotos_detalle/eu_o_02.jpg", text: "eu d02" }, { url: "/fotos_detalle/eu_o_03.png", text: "eu d03" }, { url: "/fotos_detalle/eu_d_01.png", text: "eu d04" }, { url: "/fotos_detalle/eu_d_02.png", text: "eu d05" }];
  const g17p = [{ url: "/fotos_detalle/03.png", text: "gel 03" }, { url: "/fotos_detalle/04.png", text: "gel 04" }, { url: "/fotos_detalle/05.png", text: "gel 05" }, { url: "/fotos_detalle/06.png", text: "gel 06" }, { url: "/fotos_detalle/g_01.png", text: "gel 07" }];
  const g17t = [{ url: "/fotos_detalle/g_t01.png", text: "gel t01" }, { url: "/fotos_detalle/g_t02.png", text: "gel t02" }, { url: "/fotos_detalle/gt_02.jpg", text: "gel t03" }, { url: "/fotos_detalle/gt_03.jpg", text: "gel t04" }, { url: "/fotos_detalle/gt_04.jpg", text: "gel t05" }];
  const g17d = [{ url: "/fotos_detalle/g_comp.01.png", text: "gel d01" }, { url: "/fotos_detalle/g_comp.02.png", text: "gel d02" }, { url: "/fotos_detalle/g_comp.03.png", text: "gel d03" }, { url: "/fotos_detalle/g_d01.jpg", text: "gel d04" }, { url: "/fotos_detalle/g_d04.png", text: "gel d05" }];
  const g16p = [{ url: "/fotos_detalle/M_01.jpg", text: "mc 01" }, { url: "/fotos_detalle/M_02.jpg", text: "mc 02" }, { url: "/fotos_detalle/M_03.jpg", text: "mc 03" }, { url: "/fotos_detalle/M_04.jpg", text: "mc 04" }, { url: "/fotos_detalle/M_05.jpg", text: "mc 05" }, { url: "/fotos_detalle/M_06.png", text: "mc 06" }, { url: "/fotos_detalle/M_07.png", text: "mc 07" }, { url: "/fotos_detalle/M_08.jpg", text: "mc 08" }];
  const g14p = [{ url: "/fotos_detalle/lj_p01.png", text: "lj 01" }, { url: "/fotos_detalle/lj_p02.png", text: "lj 02" }, { url: "/fotos_detalle/lj_p03.png", text: "lj 03" }, { url: "/fotos_detalle/lj_p04.png", text: "lj 04" }, { url: "/fotos_detalle/lj_p05.png", text: "lj 05" }, { url: "/fotos_detalle/lj_p06.png", text: "lj 06" }];
  const g14t = [{ url: "/fotos_detalle/lj_t01.png", text: "lj t01" }, { url: "/fotos_detalle/lj_t01_b.png", text: "lj t01b" }, { url: "/fotos_detalle/lj_t01_c.png", text: "lj t01c" }, { url: "/fotos_detalle/lj_t01_d.png", text: "lj t01d" }, { url: "/fotos_detalle/lj_t02.jpg", text: "lj t02" }, { url: "/fotos_detalle/lj_t03.jpg", text: "lj t03" }, { url: "/fotos_detalle/lj_t04.jpg", text: "lj t04" }];
  const g14d = [{ url: "/fotos_detalle/lj_d01.png", text: "lj d01" }, { url: "/fotos_detalle/lj_d02.png", text: "lj d02" }, { url: "/fotos_detalle/lj_d03.png", text: "lj d03" }, { url: "/fotos_detalle/lj_d04.png", text: "lj d04" }];
  const g15p = [{ url: "/fotos_detalle/dr_p01.png", text: "dr 01" }, { url: "/fotos_detalle/dr_p02.JPG", text: "dr 02" }, { url: "/fotos_detalle/dr_p03.JPG", text: "dr 03" }, { url: "/fotos_detalle/dr_p04.JPG", text: "dr 04" }, { url: "/fotos_detalle/dr_p05.JPG", text: "dr 05" }, { url: "/fotos_detalle/dr_p06.JPG", text: "dr 06" }];
  const g15t = [{ url: "/fotos_detalle/dr_t01.jpg", text: "dr t01" }, { url: "/fotos_detalle/dr_t02.jpg", text: "dr t02" }, { url: "/fotos_detalle/dr_t03.jpg", text: "dr t03" }, { url: "/fotos_detalle/dr_t04.jpg", text: "dr t04" }, { url: "/fotos_detalle/dr_t05.png", text: "dr t05" }, { url: "/fotos_detalle/dr_t06.png", text: "dr t06" }];
  const g15d = [{ url: "/fotos_detalle/dr_d01.png", text: "dr d01" }, { url: "/fotos_detalle/dr_d02.jpg", text: "dr d02" }, { url: "/fotos_detalle/dr_d03.jpg", text: "dr d03" }, { url: "/fotos_detalle/dr_d04.jpg", text: "dr d04" }, { url: "/fotos_detalle/dr_d05.jpg", text: "dr d05" }, { url: "/fotos_detalle/dr_d06.jpg", text: "dr d06" }, { url: "/fotos_detalle/dr_d07.jpg", text: "dr d07" }, { url: "/fotos_detalle/dr_d08.jpg", text: "dr d08" }, { url: "/fotos_detalle/dr_d09.jpg", text: "dr d09" }];
  const g13p = [{ url: "/fotos_detalle/rd_p_01.jpg", text: "rd 01" }, { url: "/fotos_detalle/rd_p_02.png", text: "rd 02" }, { url: "/fotos_detalle/rd_p_03.png", text: "rd 03" }];
  const g13t = [{ url: "/fotos_detalle/rd_t_01.png", text: "rd t01" }, { url: "/fotos_detalle/rd_t_02.png", text: "rd t02" }];
  const g13d = [{ url: "/fotos_detalle/rd_d_01.JPG", text: "rd d01" }, { url: "/fotos_detalle/rd_d_02.jpg", text: "rd d02" }, { url: "/fotos_detalle/rd_d_03.JPG", text: "rd d03" }, { url: "/fotos_detalle/rd_d_04.jpg", text: "rd d04" }, { url: "/fotos_detalle/rd_d_05.jpg", text: "rd d05" }];
  const g12p = [{ url: "/fotos_detalle/pr_f_01.png", text: "pr 01" }, { url: "/fotos_detalle/pr_f_02.png", text: "pr 02" }, { url: "/fotos_detalle/pr_f_03.png", text: "pr 03" }, { url: "/fotos_detalle/pr_f_04.png", text: "pr 04" }, { url: "/fotos_detalle/pr_f_05.png", text: "pr 05" }, { url: "/fotos_detalle/pr_e_01.png", text: "pr 06" }, { url: "/fotos_detalle/pr_e_02.png", text: "pr 07" }, { url: "/fotos_detalle/pr_e_03.png", text: "pr 08" }, { url: "/fotos_detalle/pr_e_04.png", text: "pr 09" }, { url: "/fotos_detalle/pr_e_05.png", text: "pr 10" }, { url: "/fotos_detalle/pr_e_06.png", text: "pr 11" }];
  const g12t = [{ url: "/fotos_detalle/pr_o_01.jpg", text: "pr t01" }, { url: "/fotos_detalle/pr_o_02.png", text: "pr t02" }, { url: "/fotos_detalle/pr_o_03.jpg", text: "pr t03" }, { url: "/fotos_detalle/pr_o_04.jpg", text: "pr t04" }, { url: "/fotos_detalle/pr_o_05.jpg", text: "pr t05" }, { url: "/fotos_detalle/pr_o_06.jpg", text: "pr t06" }];
  const g12d = [{ url: "/fotos_detalle/pr_s_01.JPG", text: "pr d01" }, { url: "/fotos_detalle/pr_s_02.JPG", text: "pr d02" }, { url: "/fotos_detalle/pr_s_03.JPG", text: "pr d03" }, { url: "/fotos_detalle/pr_s_04.JPG", text: "pr d04" }, { url: "/fotos_detalle/pr_s_05.JPG", text: "pr d05" }, { url: "/fotos_detalle/pr_s_06.JPG", text: "pr d06" }, { url: "/fotos_detalle/pr_s_07.JPG", text: "pr d07" }, { url: "/fotos_detalle/pr_s_08.JPG", text: "pr d08" }, { url: "/fotos_detalle/pr_s_09.JPG", text: "pr d09" }, { url: "/fotos_detalle/pr_s_10.JPG", text: "pr d10" }, { url: "/fotos_detalle/pr_s_11.JPG", text: "pr d11" }, { url: "/fotos_detalle/pr_s_12.JPG", text: "pr d12" }, { url: "/fotos_detalle/pr_s_13.JPG", text: "pr d13" }, { url: "/fotos_detalle/pr_s_13b.JPG", text: "pr d13b" }, { url: "/fotos_detalle/pr_s_14.JPG", text: "pr d14" }, { url: "/fotos_detalle/pr_s_15.JPG", text: "pr d15" }, { url: "/fotos_detalle/pr_s_16.JPG", text: "pr d16" }, { url: "/fotos_detalle/pr_s_17.JPG", text: "pr d17" }, { url: "/fotos_detalle/pr_s_18.JPG", text: "pr d18" }];

  const projects = [
    { id: 1,  title: "24 seconds",          img: "/fotos_portadas/Portada_24 seconds.jpg",        galleries: [g1p,  g1t,  g1d ], sections: ["project","technical","development"], tech: ["after effects", "premiere", "resolve"],      desc: "Field Team Year Role: Exhibition Design, MEATS and CUBE.BZ, 2021, Concept, Structure technical sheets, Rendering and Assembly. In basketball, 24sec is the longest a play can last. This installation is based on this rule to represent a match without players. The installation is located on the basketball court in the central park of Poblenou, a space where the neighbors meet to make a connection and make a neighborhood, and which during the pandemic was deserted. At that time, we all lived digitally, our body was at home, but our soul wanted to keep exploring and keep playing. By exploring digital relationships, we created this game where lights bring life to the memory of space. Rather than constructing an object, we wanted to represent a system that allowed us to talk about the same moving object in different places in time. Light is what animates the system. During the time that the installation could not be carried out, the balls did not stop living. These balls have been used by the social project Comkedem, a leisure and sports project with young people with functional diversity that claims equal rights. At the end of the festival the balls will return to Comkedem.", info: { date: "2021", location: "barcelona", role: "ephemeral architecture", team: "meats" } },
    { id: 2,  title: "aria libera",          img: "/fotos_portadas/Portada_Aria libera.jpg",        galleries: [g2p,  g2t,  g2d ], sections: ["project","technical","development"], tech: ["lightroom", "indesign", "illustrator"],      desc: "la imperfección como lenguaje visual predominante. espacios que respiran a través de la asimetría, donde cada elemento incompleto construye una nueva lectura del todo.", info: { date: "2023", location: "milan", role: "set design" } },
    { id: 3,  title: "beautiful failures",   img: "/fotos_portadas/Portada_Beautiful failures.jpg", galleries: [g3p,  g3t,  g3d ], sections: ["project","technical","development"], tech: ["photoshop", "illustrator", "indesign"],      desc: "Beautiful Failures is the story of construction-desconstruction that reflects on the rich history of the Barcelona Pavilion, decoding and rethinking its architecture based on its materiality and offering new readings of the pavilion's nature. By cataloguing and installing more than 2,000 defective glass pieces collected from glassblowing workshops around Barcelona, we explore the transparency and reflectiveness of glass - material capabilities that revolutionized modern architecture at the beginning of the 20th century, epitomized by the Barcelona Pavilion. We are interested in the empathy generated by adopting a culture of care, highlighting the potential of rejected materials—reclaiming the manual, material, cultural and collaborative knowledge that allow us to move from a society of 'consumers' to a society of 'makers'.", info: { date: "2024", location: "barcelona, mies van der rohe pavilion", role: "art installation", team: "meats" } },
    { id: 4,  title: "ledsc4",               img: "/fotos_portadas/Portada_Ledsc4.jpg",              galleries: [g4p,  g4t,  g4d ], sections: ["project","technical","development"], tech: ["after effects", "cinema 4d", "resolve"],     desc: "el contraste extremo define la forma. luz y sombra esculpen una identidad reducida a su esencia, explorando los límites de la legibilidad y la percepción visual.", info: { date: "2024", location: "milan", role: "set design", team: "artec" } },
    { id: 5,  title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg",galleries: [g5p,  g5k,  g5e ], sections: ["project","kit","exhibitions"],      tech: ["lightroom", "capture one", "photoshop"],     desc: "It's been six years since the first arrived in the field of Moria. Men, women and children who fled their homes, their towns and cities because of wars or other crises that made it impossible to continue there. Since then, more than 20,000 people, including 7,000 children, have been held in Moria. This cannot continue, and together we can fight to change the destiny of these men and women, girls and boys. How can we do it? More than a year ago, Amir, a boy from Afghanistan locked up in Moria, and Noemí, a Spanish photographer living in the Netherlands, began to publish images of what happens in the Camp. You can also do a lot to help, making this reality known in your school, in your homes and in your neighborhoods. By opening this package you are becoming part of the Now You See Me Moria collective.", info: { date: "2023", location: "berlin", role: "editorial design" } },
    { id: 6,  title: "rise up",              img: "/fotos_portadas/Portada_rise up.JPG",              galleries: [g6p,  g6t,  g6d ], sections: ["project","technical","development"], tech: ["illustrator", "photoshop", "figma"],         desc: "The pyramids were introduced as autonomous and sacred bodies, an embodiment of power and engineering advancement. Their relation to the place have evolved through the years from being masses built to being the landscape. Now architecture is becoming nature, and the pyramids are performing the dance spectacle with the landscape, vanishing and re-appearing, rotating the whole land around it. The body [pyramids] vs space [desert] constantly deviates where's the actual center of the land, so we welcome you to. From this reasoning, the concept for the Rise-up event starts, that is an annual event of entrepreneurship and innovation, also aimed at stratup. It takes place in Cairo.", info: { date: "2021", location: "cairo", role: "ephemeral architecture", team: "collective" } },
    { id: 7,  title: "san sadurnì",          img: "/fotos_portadas/Portada_San sadurni.jpg",          galleries: [g7p,  g7t,  g7d ], sections: ["project","technical","development"], tech: ["premiere", "lightroom", "after effects"],    desc: "Design and installation of a versatile event space using the garden –El Pati– at the historic Can Guineu. The installation, featuring multi-purpose platforms, thoughtful landscaping and iconified by nine adjustable flags, will become a focal point for cultural events over the summer months. The flags feature an emotive print taken from the inside patio of Can Guineu bringing the inside out and a mechanism which allows the change of their orientation to suit different uses of the space.", info: { date: "2021", location: "barcelona", role: "ephemeral architecture", team: "meats" } },
    { id: 8,  title: "vora",                 img: "/fotos_portadas/Portada_vora.jpg",                 galleries: [g8p,  g8t,  []  ], sections: ["project","technical","development"], tech: ["figma", "framer", "css"],                    desc: "reducción visual al mínimo exponente. una interfaz construida desde la claridad máxima, eliminando lo superfluo para que cada elemento presente tenga peso y significado.", info: { date: "2024", location: "barcelona", role: "ephemeral architecture" } },
    { id: 9,  title: "space creation set",   img: "/fotos_portadas/Portada_Shoot LAMP.png",           galleries: [[{ url: "/fotos_detalle/sps_01.png", text: "sps 01" }, { url: "/fotos_detalle/sps_02.png", text: "sps 02" }, { url: "/fotos_detalle/sps_03.png", text: "sps 03" }, { url: "/fotos_detalle/sps_04.png", text: "sps 04" }, { url: "/fotos_detalle/sps_05.png", text: "sps 05" }, { url: "/fotos_detalle/sps_06.png", text: "sps 06" }, { url: "/fotos_detalle/sps_07.png", text: "sps 07" }, { url: "/fotos_detalle/sps_08.png", text: "sps 08" }, { url: "/fotos_detalle/sps_09.png", text: "sps 09" }, { url: "/fotos_detalle/sps_11.png", text: "sps 11" }, { url: "/fotos_detalle/sps_12.png", text: "sps 12" }, { url: "/fotos_detalle/sps_13.png", text: "sps 13" }, { url: "/fotos_detalle/sps_14.png", text: "sps 14" }, { url: "/fotos_detalle/sps_15.png", text: "sps 15" }, { url: "/fotos_detalle/sps_16.png", text: "sps 16" }], [], []], sections: ["project","technical","development"], tech: ["cinema 4d", "blender", "lightroom"],         desc: "objetos que definen el espacio que los rodea. una exploración sobre cómo la luz y la forma construyen atmósferas, donde cada pieza existe en diálogo con su entorno.", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 10, title: "product render",        img: "/fotos_portadas/Portada_product render.jpg",       galleries: [[],   [],   []  ], sections: ["project","technical","development"], tech: ["cinema 4d", "blender", "photoshop"],         desc: "la imagen como argumento de venta y de deseo. renders que trascienden la representación técnica para construir una narrativa visual en torno al objeto y su contexto.", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 11, title: "eureka",                 img: "/fotos_detalle/eu_1.png",                          galleries: [g11p, g11t, g11d], sections: ["project","technical","development"], tech: [],                                            desc: "The design process was born from the observation of works belonging to the world of art. Not only art, but also psychology studies such as those of the psychologist Metzger have been an object of study, such as the ganzfeld effect. The idea it's dividing spaces only through the use of light, avoiding the creation of visual barriers when it is absent, turned off. Clean geometric shapes have been used to avoid focusing attention on the structure but only on the behavior of light, which relates through the plexiglass loaded with titanium nanoparticles that act as mirrors for it.", info: { date: "2020-going on", location: "italy", role: "product design" } },
    { id: 13, title: "re-discover",             img: "/fotos_detalle/rd_1.png",                          galleries: [g13p, g13t, g13d], sections: ["project","technical","development"], tech: [],                                            desc: "From the history of the excavations of Piazza Kennedy in Ravenna and analyzing the forms of what once filled the square, the idea of wanting to bring to life the main lines that outlined the map below was started. The decision taken was to highlight the main walls, recreating spaces that would leave roads. Its natural simplicity and its discreet shapes allow it to fit into the urban context easily, recreating a suggestive path in history. Taking up the walls, raising them, with past measurements and giving them a natural dynamism which was that of the irregular levels of the walls found, due to deterioration. The chosen material, due to the wide shapes with ups/downs, are castings in architectural concrete, recalling the Istrian stone.", info: { date: "2024", location: "remote", role: "ephemeral architecture" } },
    { id: 12, title: "prometeo",               img: "/fotos_detalle/pr_1.JPG",                          galleries: [g12p, g12t, g12d], sections: ["project","technical","development"], tech: [],                                            desc: "Starting from the rituals of the primitive world, going from ideological attributions to cooking. Crossing the cultures of different continents, from the rudimentary ones to the experimental ones of haute cuisine. The name \"Prometheus\" Greek mythological figure ally of humanity and friend of progress, who in myth sees him challenge the Gods, stealing their fire to give it to humanity. In this case, fire indicates the technical ability to manipulate and transform the world to make it more satisfying for man. The object is covered in soapstone, through the heat of the fire, it heats up and can be cooked on it. The glass acts as a fireplace and allows, thanks to its transparency, the view between those who eat around the table. The fire will be fed with wood.", info: { date: "2024", location: "italy", role: "product design" } },
    { id: 14, title: "liu·jo",                 img: "/fotos_portadas/Portada_Liujo.png",                galleries: [g14p, g14t, g14d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "spain", role: "set design", team: "chloe rood" } },
    { id: 15, title: "dr martens",             img: "/fotos_detalle/DR_portada.png",                    galleries: [g15p, g15t, g15d], sections: ["project","technical","development"], tech: [],                                            desc: "Paris Men's Fashion Week, the approach to the showroom utilises the central location of the venue, turning it externally into a 'billboard' about Dr.Martens. Taking a cue from the 3D, graphic and flowing nature of the new Dr.Martens 'unpolished' creative. Flowing installation which moves through the space, housing and showcasing the product in different areas, creating a narrative feel. Bold and clean concept.", info: { date: "2024", location: "paris", role: "set design", team: "chloe rood" } },
    { id: 16, title: "city challenge",         img: "/fotos_detalle/M_01.jpg",                          galleries: [g16p, [],   []  ], sections: ["project","technical","development"], tech: [],                                            desc: "City Challenge is the first interactive Manchester City FC experience, located in Yas Mall, Abu Dhabi. Spanning 1,150 m², it combines immersive storytelling, interactive technology, and family-friendly entertainment. Visitors use RFID wristbands to create personalized avatars, compete across 20 interactive attractions, earn points, unlock rewards, and receive a digital Manchester City player card at the end of their journey. Highlights include a replica of the Etihad Stadium first-team dressing room, interactive games testing football skills, immersive audiovisual experiences, and challenges featuring Manchester City legends. The experience also showcases historic kits and major trophies, including the club's historic 2022/23 treble. Designed by Mediapro Exhibitions, City Challenge blends exhibition design, interactivity, and gamification to create a unique experience that encourages repeat visits and continued competition.", info: { date: "2024", location: "qatar", role: "set design", team: "mediapro" } },
    { id: 17, title: "gelateria",               img: "/fotos_detalle/01.png",                            galleries: [g17p, g17t, g17d], sections: ["project","technical","development"], tech: [],                                            desc: "An experimental space designed using 3D construction techniques, Grasshopper, and Rhino. The concept was to 3D-print the entire venue, creating a fully integrated environment enhanced by experimental painting techniques and innovative lighting solutions.", info: { date: "2024", location: "barcelona", role: "computational design", team: "artec" } }
  ];

  const trailImages = ["/BEAUTIFUL_FAILURES_AY1.jpg", "/BEAUTIFUL_FAILURES_AY3.jpg", "/BEAUTIFUL_FAILURES_AY15.jpg", "/BEAUTIFUL_FAILURES_AY37.jpg", "/BEAUTIFUL_FAILURES_AY42.jpg"];
  const [navPositions, setNavPositions] = useState({ giulia: { top: "30vh", left: "28vw", rotate: "-2deg" }, projects: { top: "70vh", left: "18vw", rotate: "4deg" }, about: { top: "48vh", left: "74vw", rotate: "-3deg" } });
  const [selectedProject, setSelectedProject] = useState(null);
  
  
  const kleinBlue = "#002FA7";
  // una sola tipografía, pequeña y fina: Archivo Light
  const fontTitle = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
  const fontBody = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
  const fontInfo = "'Archivo', 'Helvetica Neue', Arial, sans-serif";
  const [detailAccentColor, setDetailAccentColor] = useState(kleinBlue);

  // --- EFECTOS ---
  useEffect(() => {
    setHasMounted(true);
    // mientras se ve la pantalla de carga, se descargan ya las fotos del rastro de la home
    trailImages.forEach(u => { const im = new window.Image(); im.src = opt(u, "thumb"); });
    // la pantalla de carga solo sale la primera vez en cada visita, y más corta
    let seen = false;
    try { seen = sessionStorage.getItem("loaderSeen") === "1"; sessionStorage.setItem("loaderSeen", "1"); } catch {}
    const timer = setTimeout(() => setIsLoading(false), seen ? 0 : 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target;
      el.classList.remove('wclicked');
      void el.offsetWidth;
      el.classList.add('wclicked');
      el.addEventListener('animationend', () => el.classList.remove('wclicked'), { once: true });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setCarouselIndex(0); setActiveSection(0); setShowGallery(true); setLightboxImage(null); setGalleryPositions([]); setShowFullDesc(false);
    if (!selectedProject) { setDetailAccentColor(kleinBlue); return; }
    const cached = colorCacheRef.current[selectedProject.id];
    const applyColor = (colors) => {
      let best = kleinBlue, bestSat = 0;
      for (const c of colors) {
        const m = c.match(/rgb\((\d+),(\d+),(\d+)\)/);
        if (!m) continue;
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        if (sat > bestSat) { bestSat = sat; best = c; }
      }
      setDetailAccentColor(bestSat > 0.2 ? best : kleinBlue);
    };
    if (cached) { applyColor(cached); return; }
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 80; canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 80, 80);
      const pts = [[12,12],[68,12],[40,40],[12,68],[68,68]];
      const colors = pts.map(([x,y]) => { const d = ctx.getImageData(x,y,1,1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; });
      colorCacheRef.current[selectedProject.id] = colors;
      applyColor(colors);
    };
    img.src = selectedProject.img;
  }, [selectedProject]);

  useEffect(() => {
    if (showGallery && selectedProject) {
      const allImgs = selectedProject.galleries.flat();
      const n = allImgs.length;
      if (n === 0) { setGalleryPositions([[]]); return; }
      const W = window.innerWidth;
      const H = window.innerHeight;
      const padX = W * 0.08;
      const padTop = H * 0.09;
      const padBot = H * 0.09;
      const availW = W - padX * 2;
      const availH = H - padTop - padBot;
      const cols = Math.min(6, n);
      const rows = Math.ceil(n / cols);
      const cellW = availW / cols;
      const cellH = availH / rows;
      const baseSize = Math.min(cellW * 0.65, cellH * 0.65, 100);
      const positions = allImgs.map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jX = (Math.random() - 0.5) * cellW * 0.38;
        const jY = (Math.random() - 0.5) * cellH * 0.38;
        const size = baseSize;
        return {
          x: padX + col * cellW + cellW / 2 - size / 2 + jX,
          y: padTop + row * cellH + cellH / 2 - size / 2 + jY,
          size,
        };
      });
      setGalleryPositions([positions]);
    }
  }, [showGallery, selectedProject]);
  useEffect(() => { setCarouselIndex(0); }, [activeSection]);

  // Browser back button support via hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || hash === "home") { setView("home"); setSelectedProject(null); }
      else if (hash === "projects") { setView("projects"); setSelectedProject(null); }
      else if (hash === "about") { setView("about"); setSelectedProject(null); }
      else if (hash.startsWith("detail-")) {
        const projectId = parseInt(hash.replace("detail-", ""));
        const proj = projects.find(p => p.id === projectId);
        if (proj) { setView("detail"); setSelectedProject(proj); }
      } else { setView("home"); setSelectedProject(null); }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (view !== "detail" || showGallery || lightboxImage) return;
      const gallery = selectedProject?.galleries[activeSection] || [];
      const maxSection = (selectedProject?.galleries.length || 1) - 1;
      if (e.key === "ArrowRight") {
        if (carouselIndex < gallery.length - 1) {
          setCarouselIndex(i => i + 1);
        } else if (activeSection < maxSection) {
          setActiveSection(s => s + 1);
        }
      }
      if (e.key === "ArrowLeft") {
        if (carouselIndex > 0) {
          setCarouselIndex(i => i - 1);
        } else if (activeSection > 0) {
          setActiveSection(s => s - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, showGallery, lightboxImage, activeSection, carouselIndex, selectedProject]);


  useEffect(() => {
    if (view === "projects") {
      // palabras sueltas en la franja de abajo, debajo de la nube de fotos
      const r = (min, max) => `${(min + Math.random() * (max - min)).toFixed(1)}`;
      const m = window.innerWidth <= 900;
      const band = m ? [90, 94] : [83, 90];
      setProjNavPos(m ? {
        // móvil: dos filas para que no se junten
        categories: { top: `${r(87, 89)}vh`, left: `${r(4, 14)}vw` },
        projects: { top: `${r(87, 89)}vh`, left: `${r(52, 62)}vw` },
        giulia: { top: `${r(93, 95)}vh`, left: `${r(4, 14)}vw` },
        about: { top: `${r(93, 95)}vh`, left: `${r(56, 68)}vw` },
      } : {
        giulia: { top: `${r(...band)}vh`, left: `${r(4, 16)}vw` },
        projects: { top: `${r(...band)}vh`, left: `${r(26, 38)}vw` },
        categories: { top: `${r(...band)}vh`, left: `${r(48, 60)}vw` },
        about: { top: `${r(...band)}vh`, left: `${r(74, 86)}vw` },
      });
    }
    if (view === "about") {
      // palabras sueltas en los huecos libres del libro, sin girar
      const r = (min, max) => `${(min + Math.random() * (max - min)).toFixed(1)}`;
      setAboutNavPos({
        giulia: { top: `${r(68, 82)}vh`, left: `${r(6, 38)}vw` },
        about: { top: `${r(16, 38)}vh`, left: `${r(53, 59)}vw` },
        projects: { top: `${r(62, 84)}vh`, left: `${r(53, 62)}vw` },
      });
    }
    if (view === "home") {
      // cada vez que se entra en la home, las palabras caen en un sitio distinto
      const r = (min, max) => min + Math.random() * (max - min);
      const spot = (top, left) => ({ top: `${r(...top).toFixed(1)}vh`, left: `${r(...left).toFixed(1)}vw`, rotate: `${r(-6, 6).toFixed(1)}deg` });
      const mobile = window.innerWidth <= 900;
      setNavPositions(mobile ? {
        giulia: spot([22, 32], [8, 60]),
        about: spot([44, 54], [8, 60]),
        projects: spot([64, 76], [8, 55]),
      } : {
        giulia: spot([24, 42], [10, 42]),
        projects: spot([58, 80], [8, 44]),
        about: spot([30, 76], [58, 86]),
      });
    }
    if (view === "projects") {
      // fotos pequeñas repartidas por toda la pantalla, con mucho blanco; como mucho se tocan un poco
      const W = window.innerWidth, H = window.innerHeight;
      const narrow = W <= 900;
      const floor = narrow ? 84 : 80;            // debajo de esta línea va el menú
      const top0 = 3, left0 = 2;
      const placed = [];
      const positions = projects.map(() => {
        const w = narrow ? 58 + Math.random() * 28 : 88 + Math.random() * 52;   // ancho en px
        const h = w * 1.25;                                                     // alto máximo en px
        const maxX = W * (1 - left0 / 100) - w, maxY = H * floor / 100 - h;
        let best = null, bestHit = Infinity;
        // se prueban varios sitios al azar y se queda el que menos pisa a los demás
        for (let t = 0; t < 60; t++) {
          const x = W * left0 / 100 + Math.random() * (maxX - W * left0 / 100);
          const y = H * top0 / 100 + Math.random() * (maxY - H * top0 / 100);
          let hit = 0;
          for (const o of placed) {
            const ox = Math.max(0, Math.min(x + w, o.x + o.w) - Math.max(x, o.x));
            const oy = Math.max(0, Math.min(y + h * 0.8, o.y + o.h * 0.8) - Math.max(y, o.y));
            hit = Math.max(hit, (ox * oy) / Math.min(w * h * 0.8, o.w * o.h * 0.8));
          }
          if (hit < bestHit) { best = { x, y }; bestHit = hit; }
          if (hit === 0 && t > 10) break;   // sitio libre: suficiente
        }
        const p = { x: best.x, y: best.y, w, h };
        placed.push(p);
        const leftVw = (p.x / W) * 100, topVh = (p.y / H) * 100;
        return {
          leftVw, topVh, wVw: (w / W) * 100, hVh: (h / H) * 100, floorVh: floor,
          left: `${leftVw.toFixed(2)}vw`,
          top: `${topVh.toFixed(2)}vh`,
          rotation: "0deg",
          width: `${Math.round(w)}px`,
          maxH: `${Math.round(h)}px`,
        };
      });
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
    window.location.hash = `detail-${proj.id}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };


  // Prevenir renderizado hasta que el cliente esté listo
  if (!hasMounted) return <div style={{backgroundColor: "white", height: "100vh"}} />;

  return (
    <main style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", position: "relative", overflowX: "hidden" }}>
      <style jsx global>{`
        body, html, * { margin: 0; padding: 0; color: #000; -webkit-font-smoothing: antialiased; cursor: none !important; }
        .lightbox-overlay, .lightbox-overlay * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cline x1='7' y1='1' x2='7' y2='13' stroke='%23000' stroke-width='1'/%3E%3Cline x1='1' y1='7' x2='13' y2='7' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E") 7 7, crosshair !important; }
        .lightbox-close { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cline x1='2' y1='2' x2='12' y2='12' stroke='%23000' stroke-width='1'/%3E%3Cline x1='12' y1='2' x2='2' y2='12' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E") 7 7, pointer !important; }
        @media (max-width: 900px) { body, html, * { cursor: auto !important; } }
        ::-webkit-scrollbar { display: none; }
        @keyframes wclick { 0%{transform:translateX(0)} 35%{transform:translateX(3px)} 100%{transform:translateX(0)} }
        .wclicked { animation: wclick 0.2s ease-out; }
        .proj-thumb { will-change: transform; }
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
            {!isMobile && <Crosshair color="#ffffff" showLines={view === "projects" && !imagesHovered} showArrow={false} label={view === "detail" && selectedProject ? (imagesHovered ? ((selectedProject.galleries[activeSection][carouselIndex])?.text || '') : selectedProject.title) : (view === "projects" && hoveredProjectId ? (projects.find(p => p.id === hoveredProjectId)?.title || '') : '')} />}

            {/* NYSMM contact marquee */}
            {!isMobile && view === "detail" && selectedProject?.id === 5 && (
              <div style={{ position: "fixed", bottom: "0.5vh", left: 0, right: 0, height: "4vh", overflow: "hidden", zIndex: 9998, display: "flex", alignItems: "center", pointerEvents: "none" }}>
                <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marqueeScroll 30s linear infinite" }}>
                  {[0,1,2,3,4,5].map(k => (
                    <span key={k} style={{ fontFamily: fontInfo, fontSize: "10px", fontStyle: "italic", color: "#000", opacity: 0.5, paddingRight: "6vw" }}>
                      if you want more information to activate nysmm —&nbsp;
                      <a href="mailto:giulia@studio.com" style={{ color: "#000", textDecoration: "underline", pointerEvents: "auto" }}>contact</a>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Info strip — fuera del motion.div de detalle para que mixBlendMode funcione */}
            {!isMobile && view === "detail" && selectedProject && (
              <div className="about-info" style={{ position: "fixed", top: "84vh", left: 0, right: 0, zIndex: 9998, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4vw", fontSize: "11px", fontFamily: fontInfo, color: "#000", pointerEvents: "none" }}>
                <div style={{ display: "flex", gap: "2.2rem", alignItems: "center", whiteSpace: "nowrap", pointerEvents: "auto" }}>
                  <Bracket active={showGallery} onClick={() => setShowGallery(true)} onEnter={openDesc} onLeave={closeDescSoon}><span className="script">{selectedProject.title}</span></Bracket>
                  <span style={{ opacity: 0.6 }}>{selectedProject.info.date}</span>
                  <span
                    style={{ opacity: 0.6, cursor: selectedProject.info.team ? "pointer" : "default" }}
                    onMouseEnter={() => selectedProject.info.team && setLocationHovered(true)}
                    onMouseLeave={() => setLocationHovered(false)}
                  >{locationHovered && selectedProject.info.team ? selectedProject.info.team : selectedProject.info.location}</span>
                  <Bracket onClick={() => { setFilterRole(selectedProject.info.role); setSelectedProject(null); setView("projects"); window.location.hash = "projects"; }}>
                    {selectedProject.info.role} ↗
                  </Bracket>
                </div>
                <div style={{ display: "flex", gap: "2.2rem", alignItems: "center", whiteSpace: "nowrap", pointerEvents: "auto" }}>
                  {selectedProject.sections.map((sec, i) => (
                    <Bracket key={sec} active={!showGallery && activeSection === i} onClick={() => { setActiveSection(i); setShowGallery(false); }}>{sec}</Bracket>
                  ))}
                </div>
              </div>
            )}

            {/* menú fijo abajo en el centro, en la página de cada proyecto */}
            {view === "detail" && selectedProject && (
              <nav className="about-info detail-nav" style={{ fontFamily: fontInfo }}>
                <Bracket onClick={() => { setView("home"); setSelectedProject(null); window.location.hash = "home"; }}>giulia</Bracket>
                <span className="brk brk-on brk-link" onClick={() => { setView("projects"); setSelectedProject(null); setFilterRole(null); window.location.hash = "projects"; }}>
                  <span className="brk-box">(<span className="brk-dot">*</span>)</span> projects
                </span>
                <Bracket onClick={() => { setView("about"); setSelectedProject(null); window.location.hash = "about"; }}>about</Bracket>
              </nav>
            )}



            <AnimatePresence mode="wait">
              {view === "home" && (
                <motion.div key="home" className="about-info" style={{ height: "100vh", position: "relative", fontFamily: fontInfo, color: "#000" }}>
                  <ImageTrail images={trailImages.map(u => opt(u, "thumb"))}>
                    {/* guiño a la escritura: la frase se teclea letra a letra */}
                    {isMobile ? (
                      <div className="home-write">
                        <p className="home-line"><TypeLine text="ephemeral spaces" delay={900} /></p>
                      </div>
                    ) : (
                      // la frase está tapada y aparece al pasar el ratón, como rascando
                      <ScratchText className="home-scratch" brush={16}>
                        <p className="home-line">ephemeral spaces</p>
                      </ScratchText>
                    )}

                    {/* palabras colocadas al azar */}
                    {[
                      { key: "giulia", active: true },
                      { key: "about", go: () => { setView("about"); window.location.hash = "about"; } },
                      { key: "projects", go: () => { setView("projects"); setSelectedProject(null); setFilterRole(null); window.location.hash = "projects"; } },
                    ].map((w, i) => (
                      <motion.div
                        key={w.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, ...navPositions[w.key] }}
                        transition={{ opacity: { duration: 0.8, delay: 0.3 + i * 0.15 }, default: { type: "spring", stiffness: 40, damping: 14 } }}
                        whileTap={{ x: 3 }}
                        style={{ position: "absolute", zIndex: 10, fontSize: "11px" }}
                      >
                        <Bracket active={w.active} onClick={w.go}>{w.key}</Bracket>
                      </motion.div>
                    ))}

                    <div className="about-footer home-footer">
                      <span />
                      <span>©{new Date().getFullYear()} Giulia Tufariello, All Rights Reserved</span>
                    </div>
                  </ImageTrail>
                </motion.div>
              )}

              {view === "projects" && (
                <motion.div key="projects" ref={containerRef} onClick={(e) => { if (!e.target.closest("img, .brk, .proj-cats-list")) { setFilterRole(null); setShowRoleMenu(false); } }} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

                  {/* palabras sueltas abajo, cada vez en un sitio distinto */}
                  {[
                    { key: "giulia", go: () => { setView("home"); setSelectedProject(null); window.location.hash = "home"; } },
                    { key: "projects", active: true },
                    { key: "categories", cats: true },
                    { key: "about", go: () => { setView("about"); setSelectedProject(null); window.location.hash = "about"; } },
                  ].map((w, i) => (
                    <motion.div
                      key={w.key}
                      className="about-info"
                      initial={{ opacity: 0, ...projNavPos[w.key] }}
                      animate={{ opacity: 1, ...projNavPos[w.key] }}
                      transition={{ opacity: { duration: 0.8, delay: 0.3 + i * 0.15 }, default: { type: "spring", stiffness: 40, damping: 14 } }}
                      whileTap={{ x: 3 }}
                      style={{ position: "fixed", zIndex: 600, fontFamily: fontInfo, color: "#000", fontSize: "11px" }}
                    >
                      {w.cats ? (
                        <>
                          <Bracket active={showRoleMenu || !!filterRole} onClick={() => setShowRoleMenu(v => !v)}>
                            categories{filterRole && <em style={{ opacity: 0.6 }}> · {filterRole}</em>}
                          </Bracket>
                          {/* la lista se abre hacia arriba desde la palabra */}
                          <AnimatePresence>
                            {showRoleMenu && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                                className="proj-cats-list"
                              >
                                {[...new Set(projects.map(p => p.info.role))].map(role => (
                                  <Bracket
                                    key={role}
                                    active={filterRole === role}
                                    onClick={() => { setFilterRole(role === filterRole ? null : role); setShowRoleMenu(false); }}
                                  >{role}</Bracket>
                                ))}
                                {filterRole && (
                                  <span style={{ marginTop: "0.4em", opacity: 0.55 }}>
                                    <Bracket onClick={() => { setFilterRole(null); setShowRoleMenu(false); }}>all</Bracket>
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Bracket active={w.active} onClick={w.go}>{w.key}</Bracket>
                      )}
                    </motion.div>
                  ))}

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

                  {/* zona donde se pueden mover las fotos (deja libre la franja del menú) */}
                  <div ref={dragAreaRef} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: isMobile ? "84vh" : "78vh", pointerEvents: "none" }} />

                  {/* Nube de imágenes */}
                  {projects.map((proj, index) => {
                    const isHidden = filterRole && proj.info.role !== filterRole;
                    return (
                      <motion.div
                        key={proj.id} drag dragMomentum={false} dragConstraints={(() => {
                          // se puede arrastrar por la pantalla, pero sin salir de ella ni entrar en la franja del menú
                          const q = projectPositions[index]; if (!q) return undefined;
                          const vw = window.innerWidth / 100, vh = window.innerHeight / 100;
                          return { left: -q.leftVw * vw, right: (100 - q.leftVw - q.wVw) * vw, top: -q.topVh * vh, bottom: (q.floorVh - q.topVh - q.hVh) * vh };
                        })()} onClick={() => openProject(proj)}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{
                          opacity: isHidden ? 0.07 : (hoveredProjectId !== null && hoveredProjectId !== proj.id ? 0.07 : 1),
                          scale: isHidden ? 0.9 : 1,
                          pointerEvents: "none" // solo la foto recibe el ratón, no el hueco de su celda
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 14, delay: projectsIntroDone ? 0 : index * 0.06, opacity: { duration: projectsIntroDone ? 0.18 : 0.35 }, scale: { duration: projectsIntroDone ? 0.18 : undefined } }}
                        whileHover={{ scale: 1.13, zIndex: 200 }}
                        onMouseEnter={() => { if (!isHidden) { setHoveredProjectId(proj.id); extractImageColors(opt(proj.img, "thumb"), proj.id); } }}
                        onMouseLeave={() => { setHoveredProjectId(null); setGradientColors(null); }}
                        style={{ position: "absolute", top: projectPositions[index]?.top, left: projectPositions[index]?.left, width: projectPositions[index]?.width || "200px", display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 10 + index, willChange: "transform" }}
                      >
                        <img src={opt(proj.img, "thumb")} className="proj-thumb" loading="lazy" decoding="async" style={{ pointerEvents: isHidden ? "none" : "auto", cursor: "pointer", maxWidth: "100%", maxHeight: projectPositions[index]?.maxH, width: "auto", height: "auto", display: "block" }} />
                      </motion.div>
                    );
                  })}

                  {/* Título en hover */}
                  <AnimatePresence>
                  </AnimatePresence>
                </motion.div>
              )}

              {view === "about" && (
                <motion.div key="about" className="about-info" style={{ width: "100vw", minHeight: "100vh", position: "relative", background: "white", color: "#000", fontFamily: fontInfo }}>

                  {/* detalles de libro abierto: borde de las hojas arriba/abajo y canto de páginas a los lados */}
                  {!isMobile && (
                    <svg
                      viewBox="0 0 1000 1000"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
                    >
                      {BOOK_PATHS.map((d, i) => (
                        <motion.path
                          key={i}
                          d={d.path}
                          fill="none"
                          stroke="#000"
                          strokeWidth="0.3"
                          strokeOpacity={d.opacity}
                          vectorEffect="non-scaling-stroke"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 2.5, ease: "easeOut", delay: 1 + d.delay * 1.5 }}
                        />
                      ))}
                    </svg>
                  )}

                  {/* línea fina dibujada que cae por el centro */}
                  {!isMobile && (
                    <svg
                      viewBox="0 0 20 1000"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ position: "absolute", top: 0, left: "calc(50% - 10px)", width: "20px", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}
                    >
                      <motion.path
                        d={LINE_PATHS[0]}
                        fill="none"
                        stroke="#000"
                        strokeWidth="0.35"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0, d: LINE_PATHS[0] }}
                        animate={{ pathLength: 1, d: [...LINE_PATHS, LINE_PATHS[0]] }}
                        transition={{
                          pathLength: { duration: 6, ease: [0.45, 0, 0.2, 1], delay: 0.2 },
                          d: { duration: 14, ease: "easeInOut", repeat: Infinity, delay: 6.2 },
                        }}
                      />
                    </svg>
                  )}

                  {/* fotos que aparecen en medio al pasar el ratón */}
                  {!isMobile && (
                    <AnimatePresence>
                      {aboutPreview && (
                        <motion.img
                          key={aboutPreview.src}
                          src={opt(aboutPreview.src, "thumb")}
                          alt=""
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ position: "absolute", ...PREVIEW_SPOTS[aboutPreview.spot], height: "17vh", width: "auto", maxWidth: "15vw", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 5 }}
                        />
                      )}
                    </AnimatePresence>
                  )}

                  {/* bio repartida en las dos páginas, arriba */}
                  <div className="about-bio-top">
                    <p className="about-page-l"><Words text="I'm involved in a thin limbo, between design and architecture, the ephemeral, which follows the steps of the continuous changes." delay={0.1} /></p>
                    <p className="about-page-r"><Words text="I am fascinated by the studies of spaces and by the infinite possibilities of action, from the research passing through site-specific projects to art installations in a dynamic way of designing, ranging in its different fields." delay={0.35} /></p>
                  </div>

                  <div className="about-grid">

                    {/* what I do */}
                    <div className="about-list">
                      <p className="about-head script"><Words text="What I do" delay={0.2} /></p>
                      {["Concept", "Managing", "3D Design", "2D Design", "Rendering", "Lighting", "Research"].map((s, i) => (
                        <p key={s}><Words text={s} delay={0.3 + i * 0.05} /></p>
                      ))}
                      <p className="script"><Words text={'"sometimes I draw"'} delay={0.7} /></p>
                    </div>

                    <div className="about-work">
                      <p className="about-head script"><Words text="Work" delay={0.3} /></p>
                      {DOCS.map((doc, i) => (
                        <p key={doc.key}>
                          <Bracket
                            onClick={() => { setAboutPreview(null); setOpenDoc(doc.key); }}
                            onEnter={() => setAboutPreview({ src: docPage(doc, doc.cover), spot: doc.key })}
                            onLeave={() => setAboutPreview(null)}
                          ><Words text={doc.label} delay={0.4 + i * 0.05} /></Bracket>
                        </p>
                      ))}
                      <p>
                        <Bracket
                          href="/CV_Giulia%20Tufariello.pdf" download
                          onEnter={() => setAboutPreview({ src: "/pdf_previews/cv/01.jpg", spot: "cv" })}
                          onLeave={() => setAboutPreview(null)}
                        ><Words text="Download CV" delay={0.5} /></Bracket>
                      </p>
                    </div>

                    {/* contacto */}
                    <a className="about-mail" href="mailto:giuliat97@hotmail.com"><Words text="giuliat97@hotmail.com" delay={0.15} /></a>
                    <a className="about-phone" href="tel:+393662538712"><Words text="+39 366 253 8712" delay={0.2} /></a>
                    <p className="about-city"><Words text="Barcelona, (ES)" delay={0.25} /></p>
                  </div>

                  {/* palabras sueltas por el espacio (escritorio) */}
                  {!isMobile && [
                    { key: "giulia", go: () => { setView("home"); window.location.hash = "home"; } },
                    { key: "about", active: true },
                    { key: "projects", go: () => { setView("projects"); setSelectedProject(null); setFilterRole(null); window.location.hash = "projects"; } },
                  ].map((w, i) => (
                    <motion.div
                      key={w.key}
                      initial={{ opacity: 0, ...aboutNavPos[w.key] }}
                      animate={{ opacity: 1, ...aboutNavPos[w.key] }}
                      transition={{ opacity: { duration: 0.8, delay: 0.4 + i * 0.15 }, default: { type: "spring", stiffness: 40, damping: 14 } }}
                      whileTap={{ x: 3 }}
                      style={{ position: "absolute", zIndex: 6 }}
                    >
                      <Bracket active={w.active} onClick={w.go}>{w.key}</Bracket>
                    </motion.div>
                  ))}

                  {/* footer */}
                  <div className="about-footer">
                    {/* en móvil el menú va en el pie */}
                    {isMobile ? (
                    <nav className="about-nav">
                      <Bracket onClick={() => { setView("home"); window.location.hash = "home"; }}>giulia</Bracket>
                      <Bracket active>about</Bracket>
                      <Bracket onClick={() => { setView("projects"); setSelectedProject(null); setFilterRole(null); window.location.hash = "projects"; }}>projects</Bracket>
                    </nav>
                    ) : <span />}
                    <span>©{new Date().getFullYear()} Giulia Tufariello, All Rights Reserved</span>
                  </div>

                  <AnimatePresence>
                    {openDoc && (() => {
                      const doc = DOCS.find(d => d.key === openDoc);
                      return (
                        <motion.div
                          key="doc-viewer"
                          initial={{ backgroundColor: "rgba(255,255,255,0)" }}
                          animate={{ backgroundColor: "rgba(255,255,255,1)" }}
                          exit={{ backgroundColor: "rgba(255,255,255,0)" }}
                          transition={{ duration: 0.4 }}
                          data-lenis-prevent
                          onClick={() => setOpenDoc(null)}
                          style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", overscrollBehavior: "contain" }}
                        >
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", padding: "3vh 4vw", fontFamily: fontTitle, fontSize: "0.7rem", textTransform: "lowercase", background: "linear-gradient(white 60%, rgba(255,255,255,0))" }}
                          >
                            <span style={{ color: "#000" }}>{doc.label}</span>
                            <span style={{ display: "flex", gap: "2vw" }}>
                              <a href={doc.pdf} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#000", textDecoration: "none" }}>open pdf ↗</a>
                              <button onClick={() => setOpenDoc(null)} style={{ all: "unset", cursor: "pointer", color: "#000" }}>close ✕</button>
                            </span>
                          </motion.div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4vh", padding: "2vh 4vw 10vh" }}>
                            <motion.img
                              layoutId={`doc-${doc.key}`}
                              src={opt(docPage(doc, doc.cover))}
                              alt={doc.label}
                              onClick={e => e.stopPropagation()}
                              transition={{ type: "spring", stiffness: 120, damping: 20 }}
                              style={{ width: "min(92vw, 1100px)", display: "block", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}
                            />
                            {docRest(doc).map((n) => (
                              <motion.img
                                key={n}
                                src={opt(docPage(doc, n))}
                                alt=""
                                loading="lazy"
                                onClick={e => e.stopPropagation()}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-5% 0px" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{ width: "min(92vw, 1100px)", display: "block", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </motion.div>
              )}

              {view === "detail" && selectedProject && (
                isMobile ? (
                  <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh" }}>

                    {/* Header */}
                    <div style={{ padding: "14vh 6vw 3vh" }}>
                      {selectedProject.id === 5 && (
                        <p style={{ fontFamily: fontInfo, fontSize: "11px", fontStyle: "italic", color: "#000", opacity: 0.5, marginBottom: "0.6rem" }}>
                          if you want more information to activate nysmm&nbsp;<a href="mailto:giulia@studio.com" style={{ color: "#000", textDecoration: "underline" }}>contact</a>
                        </p>
                      )}
                      <h1 className="script" style={{ fontSize: "13px", color: "#000", lineHeight: "1.2", fontWeight: "normal" }}>{selectedProject.title}</h1>
                      <div style={{ display: "flex", gap: "5vw", marginTop: "0.8rem", fontFamily: fontInfo, fontSize: "11px", color: "#000", flexWrap: "wrap", opacity: 0.6 }}>
                        <span>{selectedProject.info.role}</span>
                        <span>{selectedProject.info.location}</span>
                        <span>{selectedProject.info.date}</span>
                      </div>
                    </div>

                    {/* Section tabs */}
                    <div className="about-info" style={{ display: "flex", gap: "1.6rem", flexWrap: "wrap", padding: "0 6vw 2vh", fontFamily: fontInfo, color: "#000", fontSize: "11px" }}>
                      {selectedProject.sections.map((sec, i) => (
                        <Bracket key={sec} active={activeSection === i} onClick={() => setActiveSection(i)}>{sec}</Bracket>
                      ))}
                    </div>

                    {/* Carousel */}
                    <AnimatePresence mode="wait">
                      <motion.div key={activeSection} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                        {selectedProject.galleries[activeSection].length === 0 ? (
                          <div style={{ height: "60vw", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontInfo, fontSize: "13px", fontStyle: "italic", color: "#aaa" }}>coming soon</div>
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
                                    <img src={opt(item.url)} draggable={false} loading={Math.abs(i - carouselIndex) <= 1 ? "eager" : "lazy"} decoding="async" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", userSelect: "none" }} />
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Desc */}
                    <p style={{ fontFamily: fontBody, fontSize: "11px", lineHeight: "1.5", color: "#000", opacity: 0.8, padding: "4vh 6vw 14vh" }}>{selectedProject.desc}</p>

                  </motion.div>
                ) : (
                  <motion.div key="detail" style={{ backgroundColor: "white", height: "100vh", overflow: "hidden", position: "relative" }}>

                    {/* Texto marquee arriba */}
                    <div
                      onClick={() => setShowFullDesc(v => !v)}
                      onMouseEnter={openDesc}
                      onMouseLeave={closeDescSoon}
                      style={{ position: "fixed", top: 0, left: 0, right: 0, height: "6vh", overflow: "hidden", zIndex: 9997, background: "white", display: "flex", alignItems: "center", pointerEvents: "auto", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", whiteSpace: "nowrap", animation: showFullDesc ? "none" : "marqueeScroll 160s linear infinite" }}>
                        {[0,1,2,3].map(k => (
                          <span key={k} style={{ fontFamily: fontBody, fontSize: "10px", fontStyle: "italic", color: "#000", opacity: 0.75, paddingRight: "6vw" }}>
                            {selectedProject.desc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Texto estático al clicar */}
                    <AnimatePresence>
                      {showFullDesc && (
                        <motion.div
                          key="static-desc"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setShowFullDesc(false)}
                          onMouseEnter={openDesc}
                          onMouseLeave={closeDescSoon}
                          style={{ position: "fixed", top: "6vh", left: 0, right: 0, maxHeight: "40vh", overflowY: "auto", zIndex: 9996, background: "white", padding: "2vh 6vw 3vh", cursor: "pointer", display: "flex", justifyContent: "center" }}
                        >
                          <p style={{ fontFamily: fontBody, fontSize: "11px", lineHeight: "1.5", color: "#000", maxWidth: "640px", textAlign: "center" }}>{selectedProject.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Carousel central — drag horizontal */}
                    <div
                      data-rotate
                      style={{ marginLeft: "4vw", marginRight: "4vw", marginTop: "8vh", height: "72vh", overflow: "hidden", position: "relative", cursor: "none", touchAction: "pan-y" }}
                      onWheel={(e) => {
                        // rueda vertical o deslizamiento lateral con dos dedos en el trackpad
                        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                        if (Math.abs(d) < 4 || wheelCooldownRef.current) return;
                        wheelCooldownRef.current = true;
                        setTimeout(() => { wheelCooldownRef.current = false; }, 600);
                        const gallery = selectedProject.galleries[activeSection];
                        if (d > 0) {
                          if (carouselIndex < gallery.length - 1) {
                            setCarouselIndex(i => i + 1);
                          } else if (activeSection < 2) {
                            setActiveSection(s => s + 1);
                          }
                        } else if (d < 0) {
                          if (carouselIndex > 0) {
                            setCarouselIndex(i => i - 1);
                          } else if (activeSection > 0) {
                            setActiveSection(s => s - 1);
                          }
                        }
                      }}
                      onMouseMove={() => { }}
                      onMouseEnter={() => { setImagesHovered(true); }}
                      onClick={(e) => {
                        if (dragMovedRef.current) return; // si fue un deslizamiento, no cuenta como clic
                        const goLeft = e.clientX < window.innerWidth * 0.54;
                        if (goLeft && carouselIndex > 0) setCarouselIndex(i => i - 1);
                        else if (!goLeft && carouselIndex < selectedProject.galleries[activeSection].length - 1) setCarouselIndex(i => i + 1);
                      }}
                      onPointerDown={(e) => { dragStartRef.current = e.clientX; dragMovedRef.current = false; }}
                      onPointerUp={(e) => {
                        const dx = e.clientX - dragStartRef.current;
                        dragMovedRef.current = Math.abs(dx) > 10;
                        if (dx < -50 && carouselIndex < selectedProject.galleries[activeSection].length - 1) setCarouselIndex(i => i + 1);
                        else if (dx > 50 && carouselIndex > 0) setCarouselIndex(i => i - 1);
                      }}
                      onMouseLeave={() => { setImagesHovered(false); }}
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
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: fontInfo, fontSize: "13px", fontStyle: "italic", color: "#aaa" }}>coming soon</div>
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
                                    <img src={opt(item.url)} draggable={false} loading={Math.abs(i - carouselIndex) <= 1 ? "eager" : "lazy"} decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }} />
                                  )}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Moodboard vivo: tres líneas de fotos pequeñitas que se deslizan solas */}
                    <AnimatePresence>
                      {showGallery && (() => {
                        const items = selectedProject.galleries.flatMap((g, sec) => g.map((item, idx) => ({ item, sec, idx })));
                        if (items.length === 0) return null;
                        // orden "aleatorio" pero estable para cada línea (no cambia al mover el ratón)
                        const rand = (n) => { const x = Math.sin(n * 9301 + selectedProject.id * 49297) * 233280; return x - Math.floor(x); };
                        const rowOf = (r) => [...items].map((it, k) => ({ it, key: rand(k + r * 97) })).sort((a, b) => a.key - b.key).map(o => o.it);
                        return (
                          <motion.div key="strip" className="strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                            {[0, 1, 2].map((r) => {
                              const row = rowOf(r);
                              const loop = [...row, ...row, ...row, ...row]; // repetido para que el bucle no tenga corte
                              return (
                                <div key={r} className="strip-row">
                                  <div
                                    className="strip-track"
                                    style={{ animationDuration: `${Math.max(40, row.length * 6) + r * 14}s`, animationDirection: r % 2 ? "reverse" : "normal" }}
                                  >
                                    {loop.map(({ item, sec, idx }, k) => (
                                      <div
                                        key={k}
                                        className="strip-item"
                                        style={{ height: `${4.8 + rand(k + r * 31) * 4.2}vh`, marginTop: `${rand(k * 7 + r) * 7}vh` }}
                                        onClick={() => { setActiveSection(sec); setCarouselIndex(idx); setShowGallery(false); }}
                                      >
                                        {item.url.endsWith(".mp4") ? (
                                          <video src={item.url} muted playsInline preload="metadata" style={{ height: "100%", width: "auto", display: "block" }} />
                                        ) : (
                                          <img src={opt(item.url, "thumb")} loading="lazy" decoding="async" alt="" draggable={false} style={{ height: "100%", width: "auto", display: "block" }} />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    {/* Lightbox */}
                    <AnimatePresence>
                      {lightboxImage && (
                        <motion.div
                          key="lightbox"
                          className="lightbox-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setLightboxImage(null)}
                          style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <span className="lightbox-close" onClick={() => setLightboxImage(null)} style={{ position: "absolute", top: "4vh", left: "50%", transform: "translateX(-50%)", fontFamily: fontBody, fontSize: "0.7rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.1em", textTransform: "lowercase" }}>close</span>
                          {(() => {
                            const secIdx = selectedProject.galleries.findIndex(g => g.some(img => img.url === lightboxImage.url));
                            if (secIdx === -1) return null;
                            return (
                              <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: "4vh", left: "50%", transform: "translateX(-50%)" }}>
                                <motion.span
                                  animate={{ y: [0, -4, 0, 3, 0] }}
                                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                  onClick={() => { setLightboxImage(null); setActiveSection(secIdx); setShowGallery(false); }}
                                  style={{ fontFamily: fontTitle, fontSize: "0.6rem", color: detailAccentColor, letterSpacing: "0.08em", textTransform: "lowercase", cursor: "pointer", whiteSpace: "nowrap", opacity: 0.7 }}
                                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                  onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                                >{selectedProject.sections[secIdx]} →</motion.span>
                              </div>
                            );
                          })()}
                          {lightboxImage.url.endsWith(".mp4") ? (
                            <video src={lightboxImage.url} autoPlay muted loop playsInline style={{ maxWidth: "62vw", maxHeight: "72vh", objectFit: "contain" }} />
                          ) : (
                            <img src={opt(lightboxImage.url)} style={{ maxWidth: "62vw", maxHeight: "72vh", objectFit: "contain" }} />
                          )}
                        </motion.div>
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