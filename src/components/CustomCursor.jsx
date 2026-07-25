import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Slightly lagging glow for depth
  const glowX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasHover || prefersReducedMotion) return;

    setIsVisible(true);
    document.body.style.cursor = 'none';

    let animFrame = null;
    const handleMove = (e) => {
      if (animFrame) return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      const target = e.target;
      animFrame = requestAnimationFrame(() => {
        mouseX.set(clientX);
        mouseY.set(clientY);
        const isInteractive = target.closest?.('a, button, input, textarea, select, [role="button"]');
        setIsHovered(!!isInteractive);
        animFrame = null;
      });
    };
    const onLeave  = () => setIsVisible(false);
    const onEnter  = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMove);
    document.body.addEventListener('mouseleave', onLeave);
    document.body.addEventListener('mouseenter', onEnter);

    return () => {
      document.body.style.cursor = '';
      if (animFrame) cancelAnimationFrame(animFrame);
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseleave', onLeave);
      document.body.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Sharp tiny white dot — precise cursor position */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mouseX, y: mouseY,
          translateX: '-50%', translateY: '-50%',
          width: isHovered ? 7 : 5,
          height: isHovered ? 7 : 5,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 6px 2px rgba(255,255,255,0.85)',
        }}
        animate={{ scale: isHovered ? 1.4 : 1 }}
        transition={{ duration: 0.12 }}
      />

      {/* Lagging white glow aura — soft and ambient */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: glowX, y: glowY,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)',
          filter: 'blur(4px)',
        }}
        animate={{
          width:  isHovered ? 56 : 38,
          height: isHovered ? 56 : 38,
          opacity: isHovered ? 1.0 : 0.70,
        }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
}
