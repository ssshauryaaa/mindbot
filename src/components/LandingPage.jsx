import React, { useRef, Suspense, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Mannequin from './Mannequin';
import { Signature } from './Signature';
import { LiquidMetalButton } from './ui/liquid-metal-button';

export default function LandingPage() {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  // Determine if we're on a narrow mobile screen
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handlePointerMove = (e) => {
    if (animationFrame.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    animationFrame.current = requestAnimationFrame(() => {
      pointer.current.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (clientY / window.innerHeight) * 2 - 1;
      animationFrame.current = null;
    });
  };

  const handleAnimationComplete = useCallback(() => {
    setTimeout(() => navigate('/'), 300);
  }, [navigate]);

  const handleStart = useCallback(() => {
    if (animating) return;
    setAnimating(true);
  }, [animating]);

  return (
    <div
      className="w-screen h-screen bg-black text-white relative overflow-hidden select-none"
      onPointerMove={handlePointerMove}
    >
      {/* Layer 1 — video bg */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, opacity: animating ? 0.1 : 0.55, transition: 'opacity 2.2s ease' }}
      >
        <source src="/aurora-1784998368911.webm" type="video/webm" />
      </video>

      {/* Layer 2 — dark tint */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ zIndex: 1, background: animating ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)' }}
      />

      {/* Layer 3 — 3D canvas */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <Canvas
          dpr={[1, 1.5]}
          shadows
          camera={{ position: [0, 0.15, 5], fov: isMobile ? 44 : 32 }}
          style={{ cursor: 'none' }}
        >
          <ambientLight intensity={animating ? 0.8 : 0.15} />
          <pointLight position={isMobile ? [0, 0.7, 1.6] : [2.7, 0.7, 1.6]} intensity={14} color="#ff4d8d" distance={2.6} />
          <pointLight position={isMobile ? [0, 0.1, 1.4] : [1.9, 0.1, 1.4]} intensity={10} color="#38c9ff" distance={2.6} />
          <pointLight position={[1, 2.5, 3]} intensity={14} color="#dce8ff" distance={10} />
          <directionalLight position={[0, 4, 4]} intensity={0.2} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <Mannequin
              pointer={pointer}
              position={isMobile ? [0, -5.2, 0] : [2, -5.65, 0]}
              isAnimating={animating}
              onAnimationComplete={handleAnimationComplete}
            />
          </Suspense>
          <ContactShadows position={[0, -1.85, 0]} opacity={0.45} blur={2.6} far={3} frames={1} />
        </Canvas>
      </div>

      {/* Layer 4 — Responsive UI Overlays */}
      <div
        className="absolute inset-0 flex flex-col justify-between items-center px-4 sm:px-8 md:px-20 py-6 sm:py-10 pointer-events-none"
        style={{
          zIndex: 10,
          opacity: animating ? 0 : 1,
          transform: animating ? 'scale(0.95) translateY(-20px)' : 'scale(1) translateY(0)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Section — Signature Logo */}
        <div className="w-full flex justify-center pt-2 sm:pt-4 pointer-events-auto">
          <Signature
            text="Mindbot"
            fontSize={isMobile ? 52 : 120}
            color="#ffffff"
            duration={2.5}
            fontUrl="/LastoriaBoldRegular.otf"
            className="drop-shadow-2xl opacity-90 mx-auto"
          />
        </div>

        {/* Mobile Unified Stack vs Desktop Split Layout */}
        {isMobile ? (
          <div className="w-full max-w-sm flex flex-col items-center text-center gap-3.5 pb-6 pointer-events-auto">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
              Synaptica AI
            </span>
            <h1 className="text-lg font-semibold leading-snug text-white px-2">
              Where human intelligence meets artificial counterpart
            </h1>
            <p className="text-xs text-white/65 leading-relaxed px-2">
              An AI duality platform synthesizing machine logic and human empathy in genuine collaboration.
            </p>
            <div className="mt-1.5 pointer-events-auto">
              <LiquidMetalButton label="Start for Free" onClick={handleStart} />
            </div>
          </div>
        ) : (
          <div className="w-full flex items-end justify-between pb-8 pointer-events-none">
            <div className="max-w-lg">
              <p className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-white/50 mb-3 sm:mb-5">
                Synaptica
              </p>
              <h1 className="text-xl sm:text-3xl md:text-[2.75rem] font-semibold leading-[1.15] tracking-tight mb-3 sm:mb-6">
                Where human intelligence meets its artificial counterpart
              </h1>
              <p className="text-white/65 text-base leading-relaxed max-w-md">
                Design and develop an AI-powered chatbot built around the
                theme of duality — human and artificial intelligence working
                in genuine collaboration.
              </p>
            </div>
            <div className="pointer-events-auto pb-2">
              <LiquidMetalButton label="Start for Free" onClick={handleStart} />
            </div>
          </div>
        )}
      </div>

      {/* Center radial energy flare pulse */}
      {animating && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 11 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0] }}
          transition={{ duration: 2.2, times: [0, 0.4, 0.75, 1] }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at center, rgba(77,168,255,0.5) 0%, rgba(180,120,255,0.25) 35%, transparent 65%)' }}
          />
        </motion.div>
      )}

      {/* Solid Black Fade Overlay — dissolves smoothly to black at the end of the zoom */}
      <AnimatePresence>
        {animating && (
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ zIndex: 99 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}