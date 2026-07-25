import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Bot, ShieldCheck } from 'lucide-react';

export default function LaunchAppModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-void-950/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-synapse-500/50 shadow-2xl z-10 overflow-hidden"
        >
          {/* Top Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-ai-500/20 to-human-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-void-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-synapse-500/20 border border-synapse-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-synapse-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ai-400 block font-semibold">
                Route Integration Ready
              </span>
              <h3 className="text-2xl font-heading font-bold text-white">
                Launch SYNAPTICA Workspace
              </h3>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6 font-body">
            You clicked the primary entry point to launch the <strong>SYNAPTICA Chatbot Conversation Interface</strong>. The landing page routing target is wired and ready to connect to the chat application module.
          </p>

          <div className="p-4 rounded-2xl bg-void-900 border border-void-700 space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-ai-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Target Route: /app/chat-duality</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-human-400">
              <Bot className="w-4 h-4" />
              <span>Engine Status: Initialized & Awaiting Session Wire</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-gray-400 hover:text-white border border-void-700 hover:bg-void-800 transition-colors"
            >
              Return to Landing Page
            </button>
            <button
              onClick={onClose}
              className="btn-duality px-6 py-2.5 text-xs font-semibold flex items-center gap-2"
            >
              <span>Proceed to Chat Interface</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
