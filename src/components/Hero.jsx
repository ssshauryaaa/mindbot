import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, Zap, Brain } from 'lucide-react';
import SynapseOrbCanvas from './SynapseOrb';

export default function Hero({ onLaunchClick }) {
  const ctaRef = useRef(null);
  const [ctaPos, setCtaPos] = useState({ x: 0, y: 0 });

  const handleCtaMouseMove = (e) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setCtaPos({ x, y });
  };

  const handleCtaMouseLeave = () => {
    setCtaPos({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-dvh flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-void-950 bg-noise">
      {/* Background Radial Glow Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-ai-500/15 via-synapse-500/20 to-human-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-center text-center z-10">
        
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-void-900/90 border border-void-700/80 backdrop-blur-xl mb-6 shadow-xl"
        >
          <span className="flex h-2 w-2 rounded-full bg-ai-500 animate-ping" />
          <span className="text-xs font-mono tracking-wider text-gray-300 uppercase">
            Introducing Synaptica 1.0
          </span>
          <span className="text-xs font-semibold text-human-400">
            • Duality Architecture
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight max-w-5xl leading-[1.05]"
        >
          Two Minds.{' '}
          <span className="text-gradient-duality">One Synapse.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl font-body font-normal leading-relaxed"
        >
          The first AI co-pilot built on true duality — fusing human context & intuition with high-speed machine reasoning into one seamless synaptic workflow.
        </motion.p>

        {/* 3D R3F Synapse Orb Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full my-4"
        >
          <SynapseOrbCanvas />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary Magnetic CTA */}
          <motion.button
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            animate={{ x: ctaPos.x, y: ctaPos.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={onLaunchClick}
            className="w-full sm:w-auto btn-duality px-8 py-4 text-base font-medium flex items-center justify-center gap-3 cursor-pointer group shadow-2xl"
          >
            <Sparkles className="w-5 h-5 text-ai-400 group-hover:rotate-12 transition-transform" />
            <span>Try the Demo</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Secondary Ghost CTA */}
          <a
            href="#concept"
            className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-medium text-gray-300 hover:text-white border border-void-700/80 hover:border-synapse-500/50 bg-void-900/50 hover:bg-void-800/80 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-synapse-400 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>

        {/* Trust Pill Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-human-400" />
            <span>Human Intuition</span>
          </div>
          <span className="text-void-700">•</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-ai-400" />
            <span>Machine Speed</span>
          </div>
          <span className="text-void-700">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-synapse-500" />
            <span>Zero Hallucination Loop</span>
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex justify-center z-10 mt-6"
      >
        <a
          href="#concept"
          className="text-gray-400 hover:text-white flex flex-col items-center gap-1 transition-colors"
          aria-label="Scroll down to Duality Concept"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-synapse-400" />
        </a>
      </motion.div>
    </section>
  );
}
