import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  GraduationCap,
  Wrench,
  Eye,
  Database,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

function BentoCard({ className = '', icon: Icon, title, description, badge, accentColor = 'ai' }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPos({ x, y });

    // 3D Tilt calculation (max 8 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSpotlightPos({ x: -100, y: -100 });
  };

  const accentBorder =
    accentColor === 'human'
      ? 'hover:border-human-500/50'
      : accentColor === 'bridge'
      ? 'hover:border-synapse-500/50'
      : 'hover:border-ai-500/50';

  const accentGlow =
    accentColor === 'human'
      ? 'rgba(178,75,243,0.18)'
      : accentColor === 'bridge'
      ? 'rgba(124,92,255,0.22)'
      : 'rgba(0,212,255,0.18)';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${accentBorder} ${className}`}
    >
      {/* Dynamic Cursor Spotlight Glow Overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${accentGlow}, transparent 80%)`,
        }}
      />

      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-md ${
              accentColor === 'human'
                ? 'bg-human-500/10 border-human-500/30 text-human-400'
                : accentColor === 'bridge'
                ? 'bg-synapse-500/10 border-synapse-500/30 text-synapse-400'
                : 'bg-ai-500/10 border-ai-500/30 text-ai-400'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>

          {badge && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-void-900 border border-void-700 text-gray-400">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2 group-hover:text-gradient-duality transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed font-body">
          {description}
        </p>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-synapse-400" />
        <span>Explore Capability</span>
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-28 bg-void-950 relative overflow-hidden">
      {/* Background Decorative Grids */}
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ai-400 font-semibold">
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mt-3 tracking-tight">
            Built for Complex <span className="text-gradient-duality">Cognitive Work</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            Designed from the ground up to solve technical, academic, and creative challenges alongside you.
          </p>
        </div>

        {/* Aceternity Style Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 2-column wide */}
          <BentoCard
            className="md:col-span-2"
            icon={BrainCircuit}
            title="Real-Time Reasoning Assistant"
            description="Executes step-by-step logic, mathematical proofs, and architectural design alongside your natural language prompts with zero lag."
            badge="Core System"
            accentColor="bridge"
          />

          {/* Card 2: 1-column standard */}
          <BentoCard
            className="md:col-span-1"
            icon={GraduationCap}
            title="Personalized Learning Companion"
            description="Adapts explanation complexity dynamically based on your background knowledge and real-time comprehension signals."
            badge="Adaptive UI"
            accentColor="human"
          />

          {/* Card 3: 1-column standard */}
          <BentoCard
            className="md:col-span-1"
            icon={Wrench}
            title="Problem-Solving Co-Pilot"
            description="Deconstructs ambiguous technical briefs into structured code, diagrams, and verifiable execution paths."
            badge="Engineering"
            accentColor="ai"
          />

          {/* Card 4: 2-column wide */}
          <BentoCard
            className="md:col-span-2"
            icon={Eye}
            title="Explainable AI Reasoner"
            description="Inspect the full internal thinking chain before every answer. Never trust a black box — verify the logic tree step by step."
            badge="Transparency"
            accentColor="bridge"
          />

          {/* Card 5: 2-column wide */}
          <BentoCard
            className="md:col-span-2"
            icon={Database}
            title="Contextual Synaptic Memory"
            description="Remembers project conventions, technical decisions, and personal mental models across sessions without vector degradation."
            badge="Infinite Context"
            accentColor="human"
          />

          {/* Card 6: 1-column standard */}
          <BentoCard
            className="md:col-span-1"
            icon={Layers}
            title="Multi-Domain Synthesis"
            description="Fluidly switches across software architecture, academic literature, creative writing, and data science."
            badge="Cross-Domain"
            accentColor="ai"
          />

        </div>

      </div>
    </section>
  );
}
