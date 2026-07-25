import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, Users, Award, Sparkles } from 'lucide-react';

const statsData = [
  {
    id: 1,
    value: 99.4,
    suffix: '%',
    label: 'Reasoning Verifiability',
    desc: 'Self-consistency graph validation rate',
    icon: ShieldCheck,
    color: 'ai',
  },
  {
    id: 2,
    value: 42,
    suffix: 'ms',
    label: 'Average Latency',
    desc: 'Dual-stream synthesis response time',
    icon: Zap,
    color: 'bridge',
  },
  {
    id: 3,
    value: 50,
    suffix: 'k+',
    label: 'Active Co-Pilots',
    desc: 'Engineers & researchers daily',
    icon: Users,
    color: 'human',
  },
  {
    id: 4,
    value: 0.0,
    suffix: ' Zero',
    label: 'Hallucination Leaks',
    desc: 'Guaranteed explainable output tree',
    icon: Award,
    color: 'ai',
  },
];

const marqueeTags = [
  'Python & PyTorch',
  'TypeScript & React',
  'LaTeX & MathJax',
  'Rust & Async Core',
  'Distributed Graphs',
  'Quantum Mechanics',
  'Medical Literature',
  'Financial Synthesis',
  'Legal Precedent Search',
  'Creative Worldbuilding',
];

function CountUpNumber({ targetValue, suffix }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // ms
    const frameTime = 1000 / 60;
    const totalFrames = Math.round(duration / frameTime);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const value = start + (targetValue - start) * easeProgress;

      setCurrent(value);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCurrent(targetValue);
      }
    }, frameTime);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {targetValue % 1 !== 0 ? current.toFixed(1) : Math.round(current)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-24 bg-void-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="glass-card rounded-3xl p-8 border-void-700 hover:border-synapse-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        stat.color === 'human'
                          ? 'bg-human-500/10 border-human-500/30 text-human-400'
                          : stat.color === 'bridge'
                          ? 'bg-synapse-500/10 border-synapse-500/30 text-synapse-400'
                          : 'bg-ai-500/10 border-ai-500/30 text-ai-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Sparkles className="w-4 h-4 text-void-700 group-hover:text-synapse-400 transition-colors" />
                  </div>

                  <div className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight mb-2">
                    <CountUpNumber targetValue={stat.value} suffix={stat.suffix} />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-200 mb-1">
                    {stat.label}
                  </h3>

                  <p className="text-xs text-gray-400 font-body">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite Marquee of Domain Capabilities */}
        <div className="border-t border-b border-void-700/60 py-6 overflow-hidden relative">
          <div className="flex w-max gap-8 animate-marquee">
            {[...marqueeTags, ...marqueeTags].map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 px-4 py-2 rounded-full bg-void-900 border border-void-800 shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-synapse-500" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Marquee Animation Keyframes injected */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
