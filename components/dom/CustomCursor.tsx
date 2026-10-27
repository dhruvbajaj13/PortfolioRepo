'use client';

import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovered = false;
    let isClicked = false;
    let animId: number;

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
    };

    const onMouseDown = () => {
      isClicked = true;
    };

    const onMouseUp = () => {
      isClicked = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    // Smooth zero-GC RAF loop with hardware-accelerated transform3d
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lerp for outer ring
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0) scale(${isClicked ? 0.7 : isHovered ? 1.4 : 1})`;
      }

      if (ringRef.current) {
        const ringSize = isHovered ? 34 : 20;
        const ringOffset = ringSize / 2;
        ringRef.current.style.width = `${ringSize}px`;
        ringRef.current.style.height = `${ringSize}px`;
        ringRef.current.style.transform = `translate3d(${ringX - ringOffset}px, ${ringY - ringOffset}px, 0) scale(${isClicked ? 0.85 : 1})`;
        ringRef.current.style.borderColor = isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.35)';
        ringRef.current.style.backgroundColor = isHovered ? 'rgba(255, 255, 255, 0.12)' : 'transparent';
      }
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none select-none">
      {/* Outer Sleek Glow Ring (GPU Hardware Accelerated) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-white/35 transition-[border-color,background-color] duration-150 shadow-[0_0_12px_rgba(255,255,255,0.25)] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Inner Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
