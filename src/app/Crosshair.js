"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const lerp = (a, b, n) => (1 - n) * a + n * b;

// giro de la cruz pequeña: al rozar algo pulsable y extra al hacer clic
const HOVER_ROT = 22;
const CLICK_ROT = 25;

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }
  return { x: e.clientX, y: e.clientY };
};

const Crosshair = ({ color = 'white', containerRef = null, showLines = true, showArrow = false, label = '' }) => {
  const cursorRef = useRef(null);
  const lineHorizontalRef = useRef(null);
  const lineVerticalRef = useRef(null);
  const smallCrossRef = useRef(null);
  const crossLinesRef = useRef(null);
  const filterXRef = useRef(null);
  const filterYRef = useRef(null);
  const showArrowRef = useRef(showArrow);
  useEffect(() => { showArrowRef.current = showArrow; }, [showArrow]);

  const mouse = useRef({ x: 0, y: 0 });
  const hoverRotRef = useRef(0);
  const pressedRef = useRef(false);

  const isClickable = (el) => {
    let node = el;
    while (node && node !== document.body) {
      if (node.style?.cursor === 'pointer') return true;
      if (node.classList?.contains('brk') && !node.classList.contains('brk-on')) return true;
      if (node.tagName === 'A' || node.tagName === 'BUTTON') return true;
      // también al pasar por imágenes, vídeos o zonas marcadas (p. ej. el carrusel)
      if (node.tagName === 'IMG' || node.tagName === 'VIDEO' || node.dataset?.rotate !== undefined) return true;
      node = node.parentElement;
    }
    return false;
  };

  useEffect(() => {
    const handleMouseMove = ev => {
      mouse.current = getMousePos(ev, containerRef?.current);

      if (smallCrossRef.current) {
        gsap.set(smallCrossRef.current, { x: mouse.current.x, y: mouse.current.y, opacity: 1 });
        if (showArrowRef.current) {
          gsap.set(smallCrossRef.current, { rotation: 0 });
        } else {
          // al rozar algo pulsable la cruz gira un poco
          const clickable = isClickable(ev.target) || (ev.target instanceof Element && getComputedStyle(ev.target).cursor === 'pointer');
          const rot = clickable ? HOVER_ROT : 0;
          if (rot !== hoverRotRef.current && !pressedRef.current) {
            gsap.to(smallCrossRef.current, { rotation: rot, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          }
          hoverRotRef.current = rot;
        }
      }

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const lines = [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean);
        if (lines.length) {
          if (
            ev.clientX < bounds.left || ev.clientX > bounds.right ||
            ev.clientY < bounds.top  || ev.clientY > bounds.bottom
          ) {
            gsap.to(lines, { opacity: 0 });
          } else {
            gsap.to(lines, { opacity: 0.4 });
          }
        }
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    // al hacer clic la cruz gira un poco más y vuelve
    const handleDown = () => {
      if (!smallCrossRef.current || showArrowRef.current) return;
      pressedRef.current = true;
      gsap.to(smallCrossRef.current, { rotation: hoverRotRef.current + CLICK_ROT, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
    };
    const handleUp = () => {
      if (!smallCrossRef.current || showArrowRef.current) return;
      pressedRef.current = false;
      gsap.to(smallCrossRef.current, { rotation: hoverRotRef.current, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    };
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    const lines = [lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean);
    if (lines.length) gsap.set(lines, { opacity: 0 });
    if (smallCrossRef.current) gsap.set(smallCrossRef.current, { opacity: 0 });

    const onFirstMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y;
      if (lines.length) gsap.to(lines, { duration: 0.9, ease: 'Power3.easeOut', opacity: 0.4 });
      requestAnimationFrame(render);
      target.removeEventListener('mousemove', onFirstMove);
    };
    target.addEventListener('mousemove', onFirstMove);

    const primitiveValues = { turbulence: 0 };
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = `url(#filter-noise-x)`;
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = `url(#filter-noise-y)`;
      },
      onUpdate: () => {
        if (filterXRef.current) filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence);
        if (filterYRef.current) filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence);
      },
      onComplete: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = 'none';
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = 'none';
      }
    }).to(primitiveValues, {
      duration: 0.4, ease: 'power1',
      startAt: { turbulence: 0.04 }, turbulence: 0
    });

    const enter = () => tl.restart();
    const leave = () => tl.progress(1).kill();

    const render = () => {
      renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.current = mouse.current.y;
      for (const key in renderedStyles) {
        renderedStyles[key].previous = lerp(
          renderedStyles[key].previous,
          renderedStyles[key].current,
          renderedStyles[key].amt
        );
      }
      if (lineVerticalRef.current && lineHorizontalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }
      requestAnimationFrame(render);
    };

    const links = containerRef?.current
      ? containerRef.current.querySelectorAll('.project-item')
      : document.querySelectorAll('.project-item');
    links.forEach(link => {
      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);
    });

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousemove', onFirstMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      links.forEach(link => {
        link.removeEventListener('mouseenter', enter);
        link.removeEventListener('mouseleave', leave);
      });
    };
  }, [containerRef, showLines]);

  return (
    <div ref={cursorRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10005, mixBlendMode: 'difference' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
        </defs>
      </svg>

      {/* Líneas largas del crosshair */}
      {/* trazos finos y apenas irregulares, como las líneas del libro del about */}
      <div ref={lineHorizontalRef} style={{ position: 'absolute', width: '100%', height: '20px', top: '-10px', left: 0, opacity: 0, visibility: showLines ? 'visible' : 'hidden' }}>
        <svg viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}>
          <path d="M0 10 C 130 10.4, 250 9.65, 380 10.1 S 610 10.35, 730 9.8 S 890 10.25, 1000 10" fill="none" stroke={color} strokeWidth="0.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
      </div>
      <div ref={lineVerticalRef} style={{ position: 'absolute', width: '20px', height: '100%', left: '-10px', top: 0, opacity: 0, visibility: showLines ? 'visible' : 'hidden' }}>
        <svg viewBox="0 0 20 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}>
          <path d="M10 0 C 10.35 120, 9.65 240, 10.15 370 S 10.3 600, 9.8 720 S 10.25 880, 10 1000" fill="none" stroke={color} strokeWidth="0.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
      </div>

      {/* Cruz pequeña / flecha que sigue el cursor */}
      <div ref={smallCrossRef} style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, opacity: 0 }}>
        {showArrow ? (
          <span style={{ position: 'absolute', transform: 'translate(-50%, -50%)', fontSize: '1rem', color, lineHeight: 1, userSelect: 'none' }}>↓</span>
        ) : (
          <>
            <div ref={crossLinesRef} style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
              <div style={{ position: 'absolute', width: '12px', height: '1px', background: color, top: 0, left: '-6px' }} />
              <div style={{ position: 'absolute', width: '1px', height: '12px', background: color, top: '-6px', left: 0 }} />
            </div>
          </>
        )}
        {label && (
          <span style={{ position: 'absolute', left: '10px', top: '-0.45em', whiteSpace: 'nowrap', fontSize: '11px', color, fontFamily: "'Archivo', 'Helvetica Neue', Arial, sans-serif", fontWeight: 300, textTransform: 'lowercase', letterSpacing: '0.02em', userSelect: 'none' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default Crosshair;
