'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const posRef = useRef({ x: -100, y: -100 });
  const hoveredRef = useRef(false);
  const clickedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [renderState, setRenderState] = useState({ x: -100, y: -100, hovered: false, clicked: false });

  useEffect(() => {
    const update = () => {
      setRenderState({
        x: posRef.current.x,
        y: posRef.current.y,
        hovered: hoveredRef.current,
        clicked: clickedRef.current,
      });
      rafRef.current = null;
    };

    const scheduleUpdate = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      hoveredRef.current = !!(
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('interactive'))
      );
      scheduleUpdate();
    };

    const handleMouseDown = () => {
      clickedRef.current = true;
      scheduleUpdate();
    };
    const handleMouseUp = () => {
      clickedRef.current = false;
      scheduleUpdate();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { x, y, hovered, clicked } = renderState;

  return (
    <>
      {/* Outer Sleek Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-white/20 mix-blend-difference"
        animate={{
          x: x - (hovered ? 20 : 12),
          y: y - (hovered ? 20 : 12),
          width: hovered ? 40 : 24,
          height: hovered ? 40 : 24,
          scale: clicked ? 0.8 : 1,
          backgroundColor: hovered ? 'rgba(255, 107, 44, 0.15)' : 'rgba(255, 255, 255, 0)',
          borderColor: hovered ? 'rgba(255, 107, 44, 0.7)' : 'rgba(255, 255, 255, 0.2)',
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.4 }}
      />

      {/* Inner Classic Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 w-1.5 h-1.5 bg-[#FF6B2C] rounded-full mix-blend-difference"
        animate={{
          x: x - 3,
          y: y - 3,
          scale: hovered ? 1.4 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 500, mass: 0.1 }}
      />
    </>
  );
}
