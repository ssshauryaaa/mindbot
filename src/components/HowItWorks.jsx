import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Cpu, CheckCircle2, Send, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Contextual Input',
    desc: 'You feed your problem, prompt, or code snippet into Synaptica with natural intent.',
    icon: MessageSquare,
    color: 'human',
  },
  {
    num: '02',
    title: 'Synaptic Processing',
    desc: 'Dual engines process logic and contextual nuances simultaneously in under 50ms.',
    icon: Cpu,
    color: 'ai',
  },
  {
    num: '03',
    title: 'Synergy Alignment Check',
    desc: 'The reasoning graph verifies answers against human constraints and factual benchmarks.',
    icon: CheckCircle2,
    color: 'bridge',
  },
  {
    num: '04',
    title: 'Synthesized Co-Output',
    desc: 'Delivers actionable code, math, or copy accompanied by an explainable logic trace.',
    icon: Send,
    color: 'human',
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={containerRef} className="py-28 bg-void-900 relative overflow-hidden border-t border-void-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-synapse-400 font-semibold">
            Execution Flow
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mt-3 tracking-tight">
            How <span className="text-gradient-duality">Synaptica Works</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            From initial prompt to verified response in four transparent steps.
          </p>
        </div>

        {/* Desktop Connecting SVG Line */}
        <div className="hidden lg:block relative mb-12">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 1000 60">
            <path
              ref={lineRef}
              d="M 100 30 Q 300 30, 500 30 T 900 30"
              fill="none"
              stroke="url(#stepper-grad)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="stepper-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B24BF3" />
                <stop offset="50%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card rounded-3xl p-6 sm:p-8 relative border-void-700 hover:border-synapse-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-mono font-bold text-gradient-duality">
                      {step.num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        step.color === 'human'
                          ? 'bg-human-500/10 border-human-500/30 text-human-400'
                          : step.color === 'ai'
                          ? 'bg-ai-500/10 border-ai-500/30 text-ai-400'
                          : 'bg-synapse-500/10 border-synapse-500/30 text-synapse-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-synapse-400 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="lg:hidden mt-6 flex justify-end text-void-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
