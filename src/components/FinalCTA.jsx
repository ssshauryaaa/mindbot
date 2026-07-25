import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function FinalCTA({ onLaunchClick }) {
  const ctaRef = useRef(null);
  const [ctaPos, setCtaPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleCtaMouseMove = (e) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setCtaPos({ x, y });
  };

  const handleCtaMouseLeave = () => {
    setCtaPos({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    if (onLaunchClick) {
      onLaunchClick();
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-void-950">
      {/* GPU-efficient Aurora Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-ai-500/20 via-synapse-500/25 to-human-500/20 animate-aurora pointer-events-none blur-3xl opacity-70" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-void-900/90 border border-synapse-500/40 backdrop-blur-xl mb-6 shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-synapse-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
            Ready to Think in Duality?
          </span>
        </motion.div>

        {/* Big Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Amplify Your Cognition with <span className="text-gradient-duality">SYNAPTICA</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-body leading-relaxed"
        >
          Join thousands of researchers, engineers, and creators building with a second mind that complements human judgment.
        </motion.p>

        {/* Primary Action Button with Magnetic Lerp + Ripple Burst */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.button
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            onClick={handleClick}
            animate={{ x: ctaPos.x, y: ctaPos.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="btn-duality px-10 py-5 text-lg font-semibold flex items-center gap-3 cursor-pointer group shadow-2xl relative overflow-hidden"
          >
            {/* Ripple burst circles */}
            {ripples.map((r) => (
              <span
                key={r.id}
                style={{ left: r.x, top: r.y }}
                className="absolute w-4 h-4 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ripple pointer-events-none"
              />
            ))}

            <Zap className="w-5 h-5 text-ai-400 group-hover:rotate-12 transition-transform" />
            <span>Launch Synaptica Workspace</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Sub-guarantee */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-ai-400" />
            <span>No credit card required for tier 1</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-human-400" />
            <span>Instant setup in &lt; 30 seconds</span>
          </div>
        </div>

      </div>

      {/* Aurora Keyframes */}
      <style>{`
        @keyframes aurora {
          0% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(-3%, 2%) scale(1.05); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .animate-aurora {
          animation: aurora 16s ease-in-out infinite alternate;
        }

        @keyframes ripple {
          0% { width: 0px; height: 0px; opacity: 1; }
          100% { width: 400px; height: 400px; opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
