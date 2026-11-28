'use client';

import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop fine-pointer devices (never on mobile/touch)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovered = false;
    let isClicked = false;
    let animId: number | null = null;

    const animate = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.22;
      ringY += dy * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0) scale(${
          isClicked ? 0.7 : isHovered ? 1.4 : 1
        })`;
      }

      if (ringRef.current) {
        const ringScale = isClicked ? 0.85 : isHovered ? 1.6 : 1;
        ringRef.current.style.transform = `translate3d(${ringX - 11}px, ${ringY - 11}px, 0) scale(${ringScale})`;
        ringRef.current.style.borderColor = isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.35)';
        ringRef.current.style.backgroundColor = isHovered ? 'rgba(255, 255, 255, 0.12)' : 'transparent';
      }

      // Stop RAF loop once cursor settles so CPU/GPU idles at 0%
      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        animId = requestAnimationFrame(animate);
      } else {
        animId = null;
      }
    };

    const startLoop = () => {
      if (animId === null) {
        animId = requestAnimationFrame(animate);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target) {
        isHovered = !!(
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('interactive')
        );
      }
      startLoop();
    };

    const onMouseDown = () => {
      isClicked = true;
      startLoop();
    };

    const onMouseUp = () => {
      isClicked = false;
      startLoop();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none select-none">
      {/* Outer Sleek Glow Ring (Fixed dimensions, GPU scale-only) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[22px] h-[22px] pointer-events-none z-50 rounded-full border border-white/35 transition-[border-color,background-color] duration-150 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Inner Precision Solid Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-50 rounded-full bg-white will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
