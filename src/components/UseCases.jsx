import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Microscope,
  Eye,
  Rocket,
  Palette,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const useCasesData = [
  {
    id: 'education',
    title: 'Higher Education & Academic Research',
    icon: GraduationCap,
    category: 'Academic',
    description:
      'Guides students and researchers through complex mathematical proofs, paper literature reviews, and thesis structuring with step-by-step explainable logic.',
    highlights: [
      'Deconstructs dense LaTeX formulas into intuitive analogies',
      'Cross-references citation graphs across 100M+ academic papers',
      'Provides interactive Socratic tutoring without giving blind answers',
    ],
    accent: 'human',
  },
  {
    id: 'research',
    title: 'Research & Data Analysis',
    icon: Microscope,
    category: 'Analytics',
    description:
      'Processes raw quantitative datasets and qualitative research documents, extracting hidden correlations and formulating verifiable hypotheses.',
    highlights: [
      'Automated Python/R script generation for statistical modeling',
      'Identifies anomalies and sample bias in experiment protocols',
      'Synthesizes multi-format reports with clear data visual specs',
    ],
    accent: 'ai',
  },
  {
    id: 'accessibility',
    title: 'Inclusive & Accessible Learning',
    icon: Eye,
    category: 'Inclusion',
    description:
      'Empowers neurodivergent learners and individuals with sensory impairments by dynamically adapting information density and presentation formats.',
    highlights: [
      'Real-time text simplification and Dyslexia-friendly formatting',
      'Multimodal audio/visual prompt translation',
      'Cognitive load management with structured step-by-step pacing',
    ],
    accent: 'bridge',
  },
  {
    id: 'productivity',
    title: 'Software & System Architecture',
    icon: Rocket,
    category: 'Engineering',
    description:
      'Acts as a senior pair-programmer that reviews code for security vulnerabilities, refactors legacy services, and drafts system architecture blueprints.',
    highlights: [
      'Zero-latency refactoring suggestions with inline diff explanations',
      'Distributed systems topology design and failure mode analysis',
      'Converts high-level product specifications into executable code',
    ],
    accent: 'ai',
  },
  {
    id: 'creative',
    title: 'Creative Collaboration & Storytelling',
    icon: Palette,
    category: 'Creative',
    description:
      'Combines artistic intuition with narrative structure algorithms to assist authors, designers, and creative directors in worldbuilding and scriptwriting.',
    highlights: [
      'Character arc consistency tracking across long-form manuscripts',
      'Visual aesthetic prompt engineering and design system drafting',
      'Interactive narrative branching and plot obstacle brainstorms',
    ],
    accent: 'human',
  },
];

export default function UseCases({ onLaunchClick }) {
  const [activeTab, setActiveTab] = useState('education');

  const currentCase = useCasesData.find((c) => c.id === activeTab) || useCasesData[0];

  return (
    <section id="use-cases" className="py-28 bg-void-900 relative overflow-hidden border-t border-void-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-human-400 font-semibold">
            Versatile Applications
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mt-3 tracking-tight">
            Designed for <span className="text-gradient-duality">Every Cognitive Domain</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            See how the duality model transforms workflows across academia, engineering, and creative fields.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {useCasesData.map((uc) => {
            const Icon = uc.icon;
            const isActive = activeTab === uc.id;
            return (
              <button
                key={uc.id}
                onClick={() => setActiveTab(uc.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-void-800 text-white border border-synapse-500 shadow-[0_0_20px_rgba(124,92,255,0.3)]'
                    : 'bg-void-950/60 text-gray-400 border border-void-700 hover:text-white hover:border-void-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-synapse-400' : 'text-gray-400'}`} />
                <span>{uc.category}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Active Tab Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCase.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-3xl p-8 sm:p-12 border-void-700 relative overflow-hidden"
            >
              {/* Corner Glow Accent */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                  currentCase.accent === 'human'
                    ? 'bg-human-500/10'
                    : currentCase.accent === 'bridge'
                    ? 'bg-synapse-500/10'
                    : 'bg-ai-500/10'
                }`}
              />

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    currentCase.accent === 'human'
                      ? 'bg-human-500/10 border-human-500/30 text-human-400'
                      : currentCase.accent === 'bridge'
                      ? 'bg-synapse-500/10 border-synapse-500/30 text-synapse-400'
                      : 'bg-ai-500/10 border-ai-500/30 text-ai-400'
                  }`}
                >
                  <currentCase.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
                    Domain Case Study
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                    {currentCase.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 font-body">
                {currentCase.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-3 pt-6 border-t border-void-700">
                <h4 className="text-xs font-mono uppercase tracking-wider text-synapse-400 font-semibold mb-4">
                  Key Duality Capabilities:
                </h4>
                {currentCase.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-ai-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* CTA Action Bar inside Case Card */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-void-700/60">
                <span className="text-xs font-mono text-gray-400">
                  Ready to deploy in {currentCase.category.toLowerCase()} environments?
                </span>
                <button
                  onClick={onLaunchClick}
                  className="btn-duality px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
