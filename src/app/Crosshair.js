"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e, container) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  }
  return { x: e.clientX, y: e.clientY };
};

const Crosshair = ({ color = 'black', containerRef = null }) => {
  const cursorRef = useRef(null);
  const lineHorizontalRef = useRef(null);
  const lineVerticalRef = useRef(null);
  const filterXRef = useRef(null);
  const filterYRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = ev => {
      mouse.current = getMousePos(ev, containerRef?.current);

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        if (
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom
        ) {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });
        } else {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 1 });
        }
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });

    const onFirstMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y;
      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      });
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
      duration: 0.5,
      ease: 'power1',
      startAt: { turbulence: 0.05 },
      turbulence: 0
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

    // Aplicar el efecto de glitch a todos los elementos con clase "project-item"
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
      links.forEach(link => {
        link.removeEventListener('mouseenter', enter);
        link.removeEventListener('mouseleave', leave);
      });
    };
  }, [containerRef]);

  return (
    <div ref={cursorRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div ref={lineHorizontalRef} style={{ position: 'absolute', width: '100%', height: '1px', background: color, top: 0, opacity: 0 }} />
      <div ref={lineVerticalRef} style={{ position: 'absolute', height: '100%', width: '1px', background: color, left: 0, opacity: 0 }} />
    </div>
  );
};

export default Crosshair;