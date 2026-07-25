import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Cpu, Sparkles, Flame, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DualityConcept() {
  const sectionRef = useRef(null);
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);
  const fusionNodeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate SVG left stroke line
      if (leftLineRef.current) {
        const length = leftLineRef.current.getTotalLength();
        gsap.set(leftLineRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(leftLineRef.current, {
          strokeDashoffset: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        });
      }

      // Animate SVG right stroke line
      if (rightLineRef.current) {
        const length = rightLineRef.current.getTotalLength();
        gsap.set(rightLineRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(rightLineRef.current, {
          strokeDashoffset: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        });
      }

      // Animate Center Fusion Node Pulse
      if (fusionNodeRef.current) {
        gsap.fromTo(
          fusionNodeRef.current,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1.2,
            opacity: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'center 60%',
              end: 'center 40%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="concept"
      ref={sectionRef}
      className="relative py-28 bg-void-900 overflow-hidden border-t border-b border-void-700/60"
    >
      {/* Background Soft Glow Gradients */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-human-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-ai-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-synapse-400 font-semibold">
            The Core Paradigm
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mt-3 tracking-tight">
            Two Minds, <span className="text-gradient-duality">One Purpose</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4 leading-relaxed">
            AI shouldn't replace your judgment — it should amplify it. Synaptica links human intuition with synthetic precision to form a single cognitive engine.
          </p>
        </div>

        {/* Split-Screen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative items-stretch">

          {/* Center Fusion Connecting Graphic (Desktop SVG Overlay) */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-20">
            <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B24BF3" />
                  <stop offset="100%" stopColor="#7C5CFF" />
                </linearGradient>
                <linearGradient id="right-grad" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#7C5CFF" />
                </linearGradient>
              </defs>

              {/* Left path traveling to center */}
              <path
                ref={leftLineRef}
                d="M 200 200 C 350 200, 420 200, 500 200"
                fill="none"
                stroke="url(#left-grad)"
                strokeWidth="4"
              />

              {/* Right path traveling to center */}
              <path
                ref={rightLineRef}
                d="M 800 200 C 650 200, 580 200, 500 200"
                fill="none"
                stroke="url(#right-grad)"
                strokeWidth="4"
              />
            </svg>

            {/* Central Synapse Fusion Node */}
            <div
              ref={fusionNodeRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-void-950 border-2 border-synapse-500 shadow-[0_0_30px_#7C5CFF] flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-synapse-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          {/* Left Card: Human Intelligence */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-human-500/20 relative overflow-hidden group hover:border-human-500/50 transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-human-500/10 rounded-full blur-3xl group-hover:bg-human-500/20 transition-all pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-human-500/10 border border-human-500/30 text-human-400 text-xs font-mono font-semibold mb-6">
                <User className="w-4 h-4 text-human-400" />
                <span>Human Mind • Intuitive & Contextual</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                Creative Intuition & Ethical Judgment
              </h3>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                Humans excel at abstract thinking, nuance, lived experience, original artistic vision, and value-based choices. You bring the intent, goals, and critical discernment that raw algorithms lack.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-void-700">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Flame className="w-4 h-4 text-human-400 shrink-0" />
                <span>Contextual Mastery</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Sparkles className="w-4 h-4 text-human-400 shrink-0" />
                <span>Abstract Vision</span>
              </div>
            </div>
          </div>

          {/* Right Card: Artificial Intelligence */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-ai-500/20 relative overflow-hidden group hover:border-ai-500/50 transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-ai-500/10 rounded-full blur-3xl group-hover:bg-ai-500/20 transition-all pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ai-500/10 border border-ai-500/30 text-ai-400 text-xs font-mono font-semibold mb-6">
                <Cpu className="w-4 h-4 text-ai-400" />
                <span>Artificial Mind • Precise & Tireless</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                High-Speed Recall & Computational Scale
              </h3>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                Artificial intelligence excels at processing gigabytes of data in milliseconds, identifying hidden cross-domain patterns, generating initial prototypes, and performing instant mathematical synthesis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-void-700">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Zap className="w-4 h-4 text-ai-400 shrink-0" />
                <span>Sub-millisecond Search</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Cpu className="w-4 h-4 text-ai-400 shrink-0" />
                <span>Pattern Synthesis</span>
              </div>
            </div>
          </div>

        </div>

        {/* Fusion Summary Bar */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-void-800/50 border border-void-700 max-w-4xl mx-auto backdrop-blur-md">
          <p className="text-sm sm:text-base text-gray-300">
            <strong className="text-synapse-400">The Synaptica Guarantee:</strong> Neither mind leads alone. Every response is verified through real-time human intent alignment and machine self-consistency loops.
          </p>
        </div>

      </div>
    </section>
  );
}
