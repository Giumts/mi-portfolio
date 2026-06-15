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
  const [showWhatIDo, setShowWhatIDo] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryPositions, setGalleryPositions] = useState([]);
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
  const g1p = [{ url: "/fotos_detalle/24_1.jpg", text: "frame 01" }, { url: "/fotos_detalle/24_2.jpg", text: "frame 02" }, { url: "/fotos_detalle/24_3.mp4", text: "frame 03" }, { url: "/fotos_detalle/24_4.jpg", text: "frame 04" }, { url: "/fotos_detalle/24_5.jpg", text: "frame 05" }];
  const g1t = [{ url: "/fotos_detalle/24_t01.png", text: "tech 01" }, { url: "/fotos_detalle/24_t02.png", text: "tech 02" }, { url: "/fotos_detalle/24_t03.png", text: "tech 03" }, { url: "/fotos_detalle/24_t04.jpg", text: "tech 04" }, { url: "/fotos_detalle/24_t05.jpg", text: "tech 05" }, { url: "/fotos_detalle/24_t06.png", text: "tech 06" }, { url: "/fotos_detalle/24_t07.png", text: "tech 07" }, { url: "/fotos_detalle/24_t08.png", text: "tech 08" }, { url: "/fotos_detalle/24_t10.jpg", text: "tech 10" }];
  const g1d = [];
  const g2  = [{ url: "/fotos_detalle/aria_1.jpg", text: "vuelo 01" }, { url: "/fotos_detalle/aria_2.jpg", text: "vuelo 02" }, { url: "/fotos_detalle/aria_3.jpg", text: "vuelo 03" }, { url: "/fotos_detalle/aria_4.jpg", text: "vuelo 04" }, { url: "/fotos_detalle/aria_5.jpg", text: "vuelo 05" }, { url: "/fotos_detalle/aria_6.jpg", text: "vuelo 06" }, { url: "/fotos_detalle/aria_7.jpg", text: "vuelo 07" }, { url: "/fotos_detalle/aria_8.jpg", text: "vuelo 08" }, { url: "/fotos_detalle/aria_9.jpg", text: "vuelo 09" }, { url: "/fotos_detalle/aria_10.jpg", text: "vuelo 10" }, { url: "/fotos_detalle/aria_11.jpg", text: "vuelo 11" }, { url: "/fotos_detalle/aria_12.jpg", text: "vuelo 12" }];
  const g3p = [{ url: "/fotos_detalle/bf_1.jpg", text: "fail 01" }, { url: "/fotos_detalle/bf_2.jpg", text: "fail 02" }, { url: "/fotos_detalle/bf_3.jpg", text: "fail 03" }, { url: "/fotos_detalle/bf_4.jpg", text: "fail 04" }, { url: "/fotos_detalle/bf_5.jpg", text: "fail 05" }, { url: "/fotos_detalle/bf_6.jpg", text: "fail 06" }, { url: "/fotos_detalle/bf_7.jpg", text: "fail 07" }, { url: "/fotos_detalle/bf_8.jpg", text: "fail 08" }];
  const g3d = [{ url: "/fotos_detalle/bf_p01.png", text: "dev 01" }, { url: "/fotos_detalle/bf_p02.png", text: "dev 02" }, { url: "/fotos_detalle/bf_p03.png", text: "dev 03" }, { url: "/fotos_detalle/bf_p04.jpg", text: "dev 04" }, { url: "/fotos_detalle/bf_p05.png", text: "dev 05" }, { url: "/fotos_detalle/bf_p06.jpg", text: "dev 06" }, { url: "/fotos_detalle/bf_p07.png", text: "dev 07" }, { url: "/fotos_detalle/bf_p08.png", text: "dev 08" }];
  const g3t = [{ url: "/fotos_detalle/bf_T01.png", text: "tech 01" }, { url: "/fotos_detalle/bf_T02.png", text: "tech 02" }, { url: "/fotos_detalle/bf_T03.png", text: "tech 03" }, { url: "/fotos_detalle/bf_T04.png", text: "tech 04" }, { url: "/fotos_detalle/bf_T05.png", text: "tech 05" }, { url: "/fotos_detalle/bf_T06.png", text: "tech 06" }, { url: "/fotos_detalle/bf_T07.png", text: "tech 07" }];
  const g4  = [{ url: "/fotos_detalle/led_1.jpg", text: "light 01" }, { url: "/fotos_detalle/led_2.jpg", text: "light 02" }, { url: "/fotos_detalle/led_3.jpg", text: "light 03" }, { url: "/fotos_detalle/led_4.jpg", text: "light 04" }, { url: "/fotos_detalle/led_5.jpg", text: "light 05" }, { url: "/fotos_detalle/led_6.png", text: "light 06" }, { url: "/fotos_detalle/led_5.png", text: "light 07" }, { url: "/fotos_detalle/led_8.jpg", text: "light 08" }, { url: "/fotos_detalle/led_7.jpg", text: "light 09" }, { url: "/fotos_detalle/led_9.jpg", text: "light 10" }, { url: "/fotos_detalle/led_9.png", text: "light 11" }, { url: "/fotos_detalle/led_10.png", text: "light 12" }, { url: "/fotos_detalle/led_11.png", text: "light 13" }, { url: "/fotos_detalle/led_12.png", text: "light 14" }, { url: "/fotos_detalle/led_13.png", text: "light 15" }];
  const g5p = [{ url: "/fotos_detalle/nysm_p01.jpg", text: "nysm 01" }, { url: "/fotos_detalle/nysm_p02.jpg", text: "nysm 02" }, { url: "/fotos_detalle/nysm_p03.jpg", text: "nysm 03" }, { url: "/fotos_detalle/nysm_p04.jpg", text: "nysm 04" }, { url: "/fotos_detalle/nysm_p05.jpg", text: "nysm 05" }, { url: "/fotos_detalle/nysm_p06.jpg", text: "nysm 06" }, { url: "/fotos_detalle/nysm_p07.jpg", text: "nysm 07" }, { url: "/fotos_detalle/nysm_p08.jpg", text: "nysm 08" }, { url: "/fotos_detalle/nysm_p09.jpg", text: "nysm 09" }, { url: "/fotos_detalle/nysm_p10.jpg", text: "nysm 10" }];
  const g5k = [{ url: "/fotos_detalle/nysm_k01.jpg", text: "kit 01" }, { url: "/fotos_detalle/nysm_k02.jpg", text: "kit 02" }, { url: "/fotos_detalle/nysm_k03.jpg", text: "kit 03" }, { url: "/fotos_detalle/nysm_k04.jpg", text: "kit 04" }, { url: "/fotos_detalle/nysm_k05.jpg", text: "kit 05" }, { url: "/fotos_detalle/nysm_k06.jpg", text: "kit 06" }, { url: "/fotos_detalle/nysm_k07.jpg", text: "kit 07" }, { url: "/fotos_detalle/nysm_k08.jpg", text: "kit 08" }, { url: "/fotos_detalle/nysm_k09.jpg", text: "kit 09" }, { url: "/fotos_detalle/nysm_k10.jpg", text: "kit 10" }, { url: "/fotos_detalle/nysm_k11.jpg", text: "kit 11" }, { url: "/fotos_detalle/nysm_k12.jpg", text: "kit 12" }];
  const g5e = [{ url: "/fotos_detalle/nysm_e01.jpg", text: "exh 01" }, { url: "/fotos_detalle/nysm_e02.jpg", text: "exh 02" }, { url: "/fotos_detalle/nysm_e03.jpg", text: "exh 03" }, { url: "/fotos_detalle/nysm_e04.jpg", text: "exh 04" }, { url: "/fotos_detalle/nysm_e05.jpg", text: "exh 05" }, { url: "/fotos_detalle/nysm_e06.jpg", text: "exh 06" }, { url: "/fotos_detalle/nysm_e07.jpeg", text: "exh 07" }, { url: "/fotos_detalle/nysm_e08.jpeg", text: "exh 08" }, { url: "/fotos_detalle/nysm_e09.jpeg", text: "exh 09" }, { url: "/fotos_detalle/nysm_e10.jpeg", text: "exh 10" }, { url: "/fotos_detalle/nysm_e11.jpeg", text: "exh 11" }];
  const g6p = [{ url: "/fotos_detalle/rs_p01.jpg", text: "rise 01" }, { url: "/fotos_detalle/rs_p02.jpg", text: "rise 02" }, { url: "/fotos_detalle/rs_p03.jpg", text: "rise 03" }, { url: "/fotos_detalle/rs_p04.jpg", text: "rise 04" }, { url: "/fotos_detalle/rs_p05.JPG", text: "rise 05" }, { url: "/fotos_detalle/rs_p06.JPG", text: "rise 06" }, { url: "/fotos_detalle/rs_p07.JPG", text: "rise 07" }, { url: "/fotos_detalle/rs_p08.JPG", text: "rise 08" }];
  const g6t = [{ url: "/fotos_detalle/rs_t01.png", text: "tech 01" }, { url: "/fotos_detalle/rs_t02.png", text: "tech 02" }, { url: "/fotos_detalle/rs_t03.png", text: "tech 03" }, { url: "/fotos_detalle/rs_t04.png", text: "tech 04" }, { url: "/fotos_detalle/rs_t05.png", text: "tech 05" }, { url: "/fotos_detalle/rs_t06.png", text: "tech 06" }, { url: "/fotos_detalle/rs_t07.png", text: "tech 07" }, { url: "/fotos_detalle/rs_t08.png", text: "tech 08" }, { url: "/fotos_detalle/rs_t09.png", text: "tech 09" }, { url: "/fotos_detalle/rs_t10.png", text: "tech 10" }, { url: "/fotos_detalle/rs_t11.png", text: "tech 11" }, { url: "/fotos_detalle/rs_t12.png", text: "tech 12" }, { url: "/fotos_detalle/rs_t13.png", text: "tech 13" }, { url: "/fotos_detalle/rs_t14.png", text: "tech 14" }, { url: "/fotos_detalle/rs_t15.png", text: "tech 15" }, { url: "/fotos_detalle/rs_t16.png", text: "tech 16" }, { url: "/fotos_detalle/rs_t17.png", text: "tech 17" }, { url: "/fotos_detalle/rs_t18.png", text: "tech 18" }, { url: "/fotos_detalle/rs_t19.png", text: "tech 19" }, { url: "/fotos_detalle/rs_t20.png", text: "tech 20" }, { url: "/fotos_detalle/rs_t21.png", text: "tech 21" }, { url: "/fotos_detalle/rs_t22.png", text: "tech 22" }, { url: "/fotos_detalle/rs_t23.png", text: "tech 23" }, { url: "/fotos_detalle/rs_t24.png", text: "tech 24" }, { url: "/fotos_detalle/rs_t25.png", text: "tech 25" }, { url: "/fotos_detalle/rs_t26.png", text: "tech 26" }, { url: "/fotos_detalle/rs_t27.png", text: "tech 27" }, { url: "/fotos_detalle/rs_t28.png", text: "tech 28" }];
  const g6d = [{ url: "/fotos_detalle/rs_d03.png", text: "dev 03" }, { url: "/fotos_detalle/rs_d04.png", text: "dev 04" }, { url: "/fotos_detalle/rs_d05.png", text: "dev 05" }, { url: "/fotos_detalle/rs_d06.png", text: "dev 06" }, { url: "/fotos_detalle/rs_d07.png", text: "dev 07" }, { url: "/fotos_detalle/rs_d08.png", text: "dev 08" }, { url: "/fotos_detalle/rs_d09.png", text: "dev 09" }, { url: "/fotos_detalle/rs_d10.png", text: "dev 10" }, { url: "/fotos_detalle/rs_d11.png", text: "dev 11" }, { url: "/fotos_detalle/rs_d12.png", text: "dev 12" }, { url: "/fotos_detalle/rs_d13.png", text: "dev 13" }, { url: "/fotos_detalle/rs_d14.png", text: "dev 14" }];
  const g7  = [{ url: "/fotos_detalle/sad_1.jpg", text: "san 01" }, { url: "/fotos_detalle/sad_2.jpg", text: "san 02" }, { url: "/fotos_detalle/sad_3.jpg", text: "san 03" }, { url: "/fotos_detalle/sad_4.jpg", text: "san 04" }, { url: "/fotos_detalle/sad_5.jpg", text: "san 05" }, { url: "/fotos_detalle/sad_6.jpg", text: "san 06" }, { url: "/fotos_detalle/sad_7.jpg", text: "san 07" }, { url: "/fotos_detalle/sad_8.jpg", text: "san 08" }];
  const g8  = [{ url: "/fotos_detalle/vora_1.jpg", text: "vora 01" }, { url: "/fotos_detalle/vora_2.jpg", text: "vora 02" }, { url: "/fotos_detalle/vora_3.jpg", text: "vora 03" }, { url: "/fotos_detalle/vora_4.jpg", text: "vora 04" }, { url: "/fotos_detalle/vora_5.jpg", text: "vora 05" }, { url: "/fotos_detalle/vora_6.jpg", text: "vora 06" }, { url: "/fotos_detalle/vora_7.jpg", text: "vora 07" }, { url: "/fotos_detalle/vora_8.jpg", text: "vora 08" }];
  const g11p = [{ url: "/fotos_detalle/eu_p_01.png", text: "eu 01" }, { url: "/fotos_detalle/eu_p_02.png", text: "eu 02" }, { url: "/fotos_detalle/eu_p_03.png", text: "eu 03" }, { url: "/fotos_detalle/eu_p_04.png", text: "eu 04" }, { url: "/fotos_detalle/eu_p_05.png", text: "eu 05" }, { url: "/fotos_detalle/eu_p_06.png", text: "eu 06" }, { url: "/fotos_detalle/eu_p_07.png", text: "eu 07" }, { url: "/fotos_detalle/eu_p_08.png", text: "eu 08" }, { url: "/fotos_detalle/eu_p_09.png", text: "eu 09" }, { url: "/fotos_detalle/eu_p_10.png", text: "eu 10" }, { url: "/fotos_detalle/eu_p_11.png", text: "eu 11" }, { url: "/fotos_detalle/eu_p_12.png", text: "eu 12" }, { url: "/fotos_detalle/eu_p_13.png", text: "eu 13" }, { url: "/fotos_detalle/eu_p_14.png", text: "eu 14" }, { url: "/fotos_detalle/eu_p_15.png", text: "eu 15" }, { url: "/fotos_detalle/eu_p_16.png", text: "eu 16" }];
  const g11t = [{ url: "/fotos_detalle/eu_c_03.png", text: "eu t03" }, { url: "/fotos_detalle/eu_c_04.png", text: "eu t04" }, { url: "/fotos_detalle/eu_c_05.png", text: "eu t05" }, { url: "/fotos_detalle/eu_c_06.png", text: "eu t06" }];
  const g11d = [{ url: "/fotos_detalle/eu_o_01.JPG", text: "eu d01" }, { url: "/fotos_detalle/eu_o_02.jpg", text: "eu d02" }, { url: "/fotos_detalle/eu_o_03.png", text: "eu d03" }, { url: "/fotos_detalle/eu_d_01.png", text: "eu d04" }, { url: "/fotos_detalle/eu_d_02.png", text: "eu d05" }];
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
  const g12d = [{ url: "/fotos_detalle/pr_s_01.JPG", text: "pr d01" }, { url: "/fotos_detalle/pr_s_02.JPG", text: "pr d02" }, { url: "/fotos_detalle/pr_s_03.JPG", text: "pr d03" }, { url: "/fotos_detalle/pr_s_04.JPG", text: "pr d04" }, { url: "/fotos_detalle/pr_s_05.JPG", text: "pr d05" }, { url: "/fotos_detalle/pr_s_06.JPG", text: "pr d06" }, { url: "/fotos_detalle/pr_s_07.JPG", text: "pr d07" }];

  const projects = [
    { id: 1,  title: "24 seconds",          img: "/fotos_portadas/Portada_24 seconds.jpg",        galleries: [g1p,  g1t,  g1d ], sections: ["project","technical","development"], tech: ["after effects", "premiere", "resolve"],      desc: "una búsqueda de la armonía en el error digital. la fragmentación del tiempo como herramienta creativa, donde el fallo se convierte en forma y el ruido en ritmo.", info: { date: "2024", location: "barcelona", role: "ephemeral architecture" } },
    { id: 2,  title: "aria libera",          img: "/fotos_portadas/Portada_Aria libera.jpg",        galleries: [g2,   g2,   g2  ], sections: ["project","technical","development"], tech: ["lightroom", "indesign", "illustrator"],      desc: "la imperfección como lenguaje visual predominante. espacios que respiran a través de la asimetría, donde cada elemento incompleto construye una nueva lectura del todo.", info: { date: "2023", location: "milan", role: "set design" } },
    { id: 3,  title: "beautiful failures",   img: "/fotos_portadas/Portada_Beautiful failures.jpg", galleries: [g3p,  g3t,  g3d ], sections: ["project","technical","development"], tech: ["photoshop", "illustrator", "indesign"],      desc: "exploración rítmica del espacio en blanco. el lienzo como campo de fuerza donde los ritmos visuales nacen del fallo y la anomalía se convierte en propuesta estética.", info: { date: "2024", location: "madrid", role: "art installation" } },
    { id: 4,  title: "ledsc4",               img: "/fotos_portadas/Portada_Ledsc4.jpg",              galleries: [g4,   g4,   g4  ], sections: ["project","technical","development"], tech: ["after effects", "cinema 4d", "resolve"],     desc: "el contraste extremo define la forma. luz y sombra esculpen una identidad reducida a su esencia, explorando los límites de la legibilidad y la percepción visual.", info: { date: "2022", location: "london", role: "set design" } },
    { id: 5,  title: "now you see me moria", img: "/fotos_portadas/Portada_Now you see me moria.jpg",galleries: [g5p,  g5k,  g5e ], sections: ["project","kit","exhibitions"],      tech: ["lightroom", "capture one", "photoshop"],     desc: "abstracción aplicada al diseño contemporáneo. la fotografía descompone el entorno para capturar lo invisible en lo cotidiano, buscando la realidad tras el filtro.", info: { date: "2023", location: "berlin", role: "editorial design" } },
    { id: 6,  title: "rise up",              img: "/fotos_portadas/Portada_rise up.JPG",              galleries: [g6p,  g6t,  g6d ], sections: ["project","technical","development"], tech: ["illustrator", "photoshop", "figma"],         desc: "fragmentos de un proceso inacabado. la belleza reside en la evolución constante, en las texturas que narran su propia creación y en la ascendencia formal como discurso.", info: { date: "2024", location: "paris", role: "ephemeral architecture" } },
    { id: 7,  title: "san sadurnì",          img: "/fotos_portadas/Portada_San sadurni.jpg",          galleries: [g7,   g7,   g7  ], sections: ["project","technical","development"], tech: ["premiere", "lightroom", "after effects"],    desc: "capturando la esencia del movimiento estático. la tensión entre lo quieto y lo dinámico se cristaliza en patrones que dialogan entre la cinemática y la imagen fija.", info: { date: "2023", location: "barcelona", role: "ephemeral architecture" } },
    { id: 8,  title: "vora",                 img: "/fotos_portadas/Portada_vora.jpg",                 galleries: [g8,   g8,   g8  ], sections: ["project","technical","development"], tech: ["figma", "framer", "css"],                    desc: "reducción visual al mínimo exponente. una interfaz construida desde la claridad máxima, eliminando lo superfluo para que cada elemento presente tenga peso y significado.", info: { date: "2024", location: "remote", role: "ephemeral architecture" } },
    { id: 9,  title: "space creation set",   img: "/fotos_portadas/Portada_Shoot LAMP.png",           galleries: [[],   [],   []  ], sections: ["project","technical","development"], tech: ["cinema 4d", "blender", "lightroom"],         desc: "objetos que definen el espacio que los rodea. una exploración sobre cómo la luz y la forma construyen atmósferas, donde cada pieza existe en diálogo con su entorno.", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 10, title: "product render",        img: "/fotos_portadas/Portada_product render.jpg",       galleries: [[],   [],   []  ], sections: ["project","technical","development"], tech: ["cinema 4d", "blender", "photoshop"],         desc: "la imagen como argumento de venta y de deseo. renders que trascienden la representación técnica para construir una narrativa visual en torno al objeto y su contexto.", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 11, title: "eureka",                 img: "/fotos_detalle/eu_1.png",                          galleries: [g11p, g11t, g11d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 13, title: "re-discover",             img: "/fotos_detalle/rd_1.png",                          galleries: [g13p, g13t, g13d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "ephemeral architecture" } },
    { id: 12, title: "prometeo",               img: "/fotos_detalle/pr_1.JPG",                          galleries: [g12p, g12t, g12d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "product design" } },
    { id: 14, title: "liu·jo",                 img: "/fotos_portadas/Portada_Liujo.png",                galleries: [g14p, g14t, g14d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "set design" } },
    { id: 15, title: "dr martens",             img: "/fotos_detalle/DR_portada.png",                    galleries: [g15p, g15t, g15d], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "set design" } },
    { id: 16, title: "city challenge",         img: "/fotos_detalle/M_01.jpg",                          galleries: [g16p, [],   []  ], sections: ["project","technical","development"], tech: [],                                            desc: "", info: { date: "2024", location: "remote", role: "set design" } }
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

  useEffect(() => { setCarouselIndex(0); setActiveSection(0); setShowGallery(true); setLightboxImage(null); setGalleryPositions([]); }, [selectedProject]);

  useEffect(() => {
    if (showGallery && selectedProject) {
      const cols = 5;
      const colHeights = [10, 38, 16, 52, 28];
      setGalleryPositions(selectedProject.galleries.map(gallery =>
        gallery.map((_, i) => ({
          col: i % cols,
          row: Math.floor(i / cols),
          heightPct: colHeights[i % cols],
          size: Math.floor(Math.random() * 20 + 72),
        }))
      ));
    }
  }, [showGallery, selectedProject]);
  useEffect(() => { setCarouselIndex(0); }, [activeSection]);



  useEffect(() => {
    if (view === "home") setNavPositions({ giulia: { top: "15vh", left: "40vw", rotate: "-2deg" }, projects: { top: "75vh", left: "15vw", rotate: "4deg" }, about: { top: "45vh", right: "12vw", rotate: "-3deg" } });
    if (view === "about") setAboutPositions({ email: { top: "25vh", left: "15vw", rotate: "-5deg" }, phone: { bottom: "25vh", right: "15vw", rotate: "5deg" } });
    if (view === "projects") {
      const cols = 4;
      const rows = Math.ceil(projects.length / cols);
      const colW = 84 / cols;
      const rowH = 80 / rows;
      const positions = projects.map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jitterX = (Math.random() - 0.5) * colW * 1.1;
        const jitterY = (Math.random() - 0.5) * rowH * 1.1;
        const baseLeft = 8 + col * colW + colW * 0.3;
        const baseTop = 10 + row * rowH + rowH * 0.3;
        return {
          top: Math.min(Math.max(baseTop + jitterY, 3), 88) + "vh",
          left: Math.min(Math.max(baseLeft + jitterX, 2), 88) + "vw",
          rotation: "0deg",
          width: Math.floor(Math.random() * 50 + 85) + "px",
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
            {!isMobile && <Crosshair color="#ffffff" showLines={view === "projects" && !imagesHovered} showArrow={false} label={view === "detail" && selectedProject ? (imagesHovered ? `${carouselArrow} ${(selectedProject.galleries[activeSection][carouselIndex])?.text || ''}` : selectedProject.title) : ''} />}

            {/* NYSMM contact marquee */}
            {!isMobile && view === "detail" && selectedProject?.id === 5 && (
              <div style={{ position: "fixed", bottom: "4vh", left: 0, right: 0, height: "4vh", overflow: "hidden", zIndex: 9998, display: "flex", alignItems: "center", pointerEvents: "none" }}>
                <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marqueeScroll 30s linear infinite" }}>
                  {[0,1,2,3,4,5].map(k => (
                    <span key={k} style={{ fontFamily: fontTitle, fontSize: "0.5rem", color: "#000", opacity: 0.45, letterSpacing: "0.1em", textTransform: "lowercase", paddingRight: "6vw" }}>
                      if you want more information to activate nysmm —&nbsp;
                      <a href="mailto:giulia@studio.com" style={{ color: "#000", textDecoration: "underline", pointerEvents: "auto" }}>contact</a>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Info strip — fuera del motion.div de detalle para que mixBlendMode funcione */}
            {!isMobile && view === "detail" && selectedProject && (
              <div style={{ position: "fixed", top: "49vh", left: 0, right: 0, zIndex: 9998, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4vw", fontFamily: fontTitle, fontSize: "0.72rem", textTransform: "lowercase", letterSpacing: "0.06em", color: "#000", pointerEvents: "none" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center", whiteSpace: "nowrap" }}>
                  <span onClick={() => setShowGallery(true)} style={{ cursor: "pointer", pointerEvents: "auto" }}>{selectedProject.title}</span>
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
                    {selectedProject.sections.map((s, i) => (
                      <span key={s} onClick={() => { setActiveSection(i); setShowGallery(false); }}
                        style={{ opacity: !showGallery && activeSection === i ? 1 : 0.3, cursor: "pointer", transition: "opacity 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = !showGallery && activeSection === i ? 1 : 0.3}
                      >
                        {s}
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#000", opacity: !showGallery && activeSection === i ? 1 : 0, transition: "opacity 0.3s ease", flexShrink: 0 }} />
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
                  <motion.p animate={{ ...aboutPositions.email }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>giuliat97@hotmail.com</motion.p>
                  <motion.p animate={{ ...aboutPositions.phone }} style={{ position: "absolute", fontFamily: fontTitle, fontSize: "0.8rem", color: kleinBlue }}>+393662538712</motion.p>

                  {/* what I do */}
                  <motion.div
                    animate={showWhatIDo ? { y: 0, rotate: -4 } : { y: [0, -5, 0, 3, 0], rotate: [-4, -2, -5, -3, -4] }}
                    transition={showWhatIDo ? { duration: 0.2 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "18vh", right: "8vw", fontFamily: fontTitle, fontSize: "0.9rem", textTransform: "lowercase", cursor: "pointer", zIndex: 100, color: kleinBlue }}
                    onClick={() => setShowWhatIDo(v => !v)}>
                    <span style={{ textDecoration: showWhatIDo ? "line-through" : "none" }}>what I do</span>
                    <AnimatePresence>
                      {showWhatIDo && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.3 }}
                          style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontFamily: fontBody, fontSize: "0.6rem", color: "#000", textAlign: "right", cursor: "default" }}
                          onClick={e => e.stopPropagation()}
                        >
                          {["product 2d and 3d design", "rendering", "lighting", "installation and interior design", "research and graphic design"].map(s => (
                            <span key={s} style={{ opacity: 0.7 }}>{s}</span>
                          ))}
                          <span style={{ opacity: 0.9, fontSize: "0.75rem", marginTop: "0.8rem" }}>always learning new things,</span>
                          <span style={{ opacity: 0.9, fontSize: "0.75rem" }}>and sometimes I draw</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0 20vw", textAlign: "center" }}>
                    <p style={{ fontFamily: fontBody, fontSize: "0.9rem", maxWidth: "450px", lineHeight: "1.6" }}>I'm involved in a thin limbo, between design and architecture, the ephemeral, which follows the steps of the continuous changes.<br/><br/>I am fascinated by the studies of spaces and by the infinite possibilities of action, from the research passing through site-specific projects to art installations in a dynamic way of designing, ranging in its different fields.</p>
                  </div>
                </motion.div>
              )}

              {view === "detail" && selectedProject && (
                isMobile ? (
                  <motion.div key="detail" style={{ backgroundColor: "white", minHeight: "100vh" }}>

                    {/* Header */}
                    <div style={{ padding: "14vh 6vw 3vh" }}>
                      {selectedProject.id === 5 && (
                        <p style={{ fontFamily: fontTitle, fontSize: "0.5rem", letterSpacing: "0.08em", color: "#000", opacity: 0.5, textTransform: "lowercase", marginBottom: "0.6rem" }}>
                          if you want more information to activate nysmm&nbsp;<a href="mailto:giulia@studio.com" style={{ color: "#000", textDecoration: "underline" }}>contact</a>
                        </p>
                      )}
                      <h1 style={{ fontFamily: fontTitle, fontSize: "0.85rem", color: "#000", lineHeight: "1.2", textTransform: "lowercase", fontWeight: "normal" }}>{selectedProject.title}</h1>
                      <div style={{ display: "flex", gap: "5vw", marginTop: "0.8rem", fontFamily: fontTitle, fontSize: "0.6rem", color: "#000", textTransform: "lowercase", flexWrap: "wrap", opacity: 0.6 }}>
                        <span>{selectedProject.info.role}</span>
                        <span>{selectedProject.info.location}</span>
                        <span>{selectedProject.info.date}</span>
                      </div>
                    </div>

                    {/* Section tabs */}
                    <div style={{ display: "flex", gap: "2rem", padding: "0 6vw 2vh", fontFamily: fontTitle, fontSize: "0.65rem", textTransform: "lowercase" }}>
                      {selectedProject.sections.map((s, i) => (
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
                  <motion.div key="detail" style={{ backgroundColor: "white", height: "100vh", overflow: "hidden", position: "relative" }}>

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
                          } else {
                            setShowGallery(true);
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

                    {/* Gallery overlay */}
                    <AnimatePresence>
                      {showGallery && (
                        <motion.div
                          key="gallery"
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ duration: 0.15, ease: "linear" }}
                          style={{ position: "absolute", inset: 0, background: "white", zIndex: 300, overflowY: "auto", overflowX: "hidden" }}
                        >
                          <div style={{ padding: "10vh 20vw 8vh" }}>
                              {selectedProject.sections.map((sectionName, sectionIdx) => {
                                const sectionImgs = selectedProject.galleries[sectionIdx];
                                if (!sectionImgs || sectionImgs.length === 0) return null;
                                const cols = 5;
                                const colPct = 100 / cols;
                                const rowH = 220;
                                const numRows = Math.ceil(sectionImgs.length / cols);
                                const groupH = numRows * rowH + 80;
                                const sectionPositions = galleryPositions[sectionIdx] || [];
                                return (
                                  <div key={sectionIdx} style={{ marginBottom: "8vh" }}>
                                    <div style={{ textAlign: "center", marginBottom: "3vh" }}>
                                      <span
                                        onClick={() => { setActiveSection(sectionIdx); setShowGallery(false); }}
                                        style={{ fontFamily: fontTitle, fontSize: "0.62rem", textTransform: "lowercase", letterSpacing: "0.06em", opacity: 0.35, cursor: "pointer", display: "inline-block" }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={e => e.currentTarget.style.opacity = 0.35}
                                      >{sectionName} →</span>
                                    </div>
                                    <div style={{ position: "relative", width: "100%", height: `${groupH}px` }}>
                                      {sectionImgs.map((item, i) => {
                                        const pos = sectionPositions[i];
                                        if (!pos) return null;
                                        return (
                                          <div
                                            key={i}
                                            onClick={() => setLightboxImage(item)}
                                            style={{ position: "absolute", top: `${pos.row * rowH + pos.heightPct * rowH / 100}px`, left: `${pos.col * colPct}%`, width: `${pos.size}px`, cursor: "pointer", transition: "opacity 0.2s ease", zIndex: 2 }}
                                            onMouseEnter={e => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.zIndex = 5; }}
                                            onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.zIndex = 2; }}
                                          >
                                            {item.url.endsWith(".mp4") ? (
                                              <video src={item.url} muted playsInline style={{ width: "100%", display: "block" }} />
                                            ) : (
                                              <img src={item.url} style={{ width: "100%", display: "block" }} />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Lightbox */}
                    <AnimatePresence>
                      {lightboxImage && (
                        <motion.div
                          key="lightbox"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setLightboxImage(null)}
                          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          {lightboxImage.url.endsWith(".mp4") ? (
                            <video src={lightboxImage.url} autoPlay muted loop playsInline style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
                          ) : (
                            <img src={lightboxImage.url} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
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