"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  scrambleChars = '.:',
  className = '',
  style = {},
  children,
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const charEls = el.querySelectorAll('.sc-char');

    const handleMove = (e) => {
      charEls.forEach((c) => {
        const rect = c.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const original = c.dataset.content;
          const arr = scrambleChars.split('');
          const dur = duration * (1 - dist / radius);
          const obj = { t: 0 };
          gsap.killTweensOf(obj);
          gsap.to(obj, {
            t: 1,
            duration: dur,
            ease: 'none',
            onUpdate() {
              c.textContent = obj.t < 0.8
                ? arr[Math.floor(Math.random() * arr.length)]
                : original;
            },
            onComplete() { c.textContent = original; },
          });
        }
      });
    };

    el.addEventListener('pointermove', handleMove);
    return () => el.removeEventListener('pointermove', handleMove);
  }, [radius, duration, scrambleChars]);

  const text = typeof children === 'string' ? children : '';

  return (
    <div ref={rootRef} className={className} style={style}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="sc-char"
          data-content={char}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ScrambledText;
