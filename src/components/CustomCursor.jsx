import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lerp physics for trailing glow
  const smoothX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 250, damping: 25 });

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!hasHover || prefersReducedMotion) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Detect hover over interactive elements
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"], .interactive');
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing Duality Glow Blob */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-40"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(178,75,243,0.3) 50%, transparent 75%)',
          filter: 'blur(8px)',
        }}
        animate={{
          scale: isHovered ? 2.2 : 1,
          opacity: isHovered ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
