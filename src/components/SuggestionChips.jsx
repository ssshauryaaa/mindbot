import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Code2, Heart, Lightbulb,
  GraduationCap, Briefcase, Brain, Sparkles,
} from "lucide-react";


const ALL_SUGGESTIONS = [
  // Education — human curiosity + AI clarity
  {
    text: "Explain this like a tutor and an AI would, side by side",
    icon: BookOpen,
    category: "education",
    accent: "#4fa8ff",
  },
  {
    text: "Quiz me using memory tricks + AI-style recall",
    icon: GraduationCap,
    category: "education",
    accent: "#4fa8ff",
  },
  // Career — human judgment meets AI insight
  {
    text: "Passion vs AI-predicted career — which wins?",
    icon: Briefcase,
    category: "career",
    accent: "#34d399",
  },
  {
    text: "Skills that'll still need a human touch by 2030",
    icon: Lightbulb,
    category: "career",
    accent: "#34d399",
  },
  // Problem-solving — the core duality demo
  {
    text: "I have an idea — help me build on it, not replace it",
    icon: Code2,
    category: "problem-solving",
    accent: "#c084fc",
  },
  {
    text: "Give logic, then let me finish the solution",
    icon: Code2,
    category: "problem-solving",
    accent: "#c084fc",
  },
  // Wellbeing — human emotion + AI support
  {
    text: "I'm overthinking — give me clarity, not the answer",
    icon: Heart,
    category: "wellbeing",
    accent: "#f472b6",
  },
  {
    text: "Help me stay motivated without losing my own drive",
    icon: Brain,
    category: "wellbeing",
    accent: "#f472b6",
  },
  // Creative — mind vs machine, collaborating
  {
    text: "I write the twist, you build the world",
    icon: Sparkles,
    category: "creative",
    accent: "#fbbf24",
  },
  {
    text: "A poem about a human mind and an AI mind",
    icon: Sparkles,
    category: "creative",
    accent: "#fbbf24",
  },
];

function useRandomSubset(items, count) {
  return useMemo(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.35 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 360, damping: 26 },
  },
};

export default function SuggestionChips({ onSelect, count = 6 }) {
  const chips = useRandomSubset(ALL_SUGGESTIONS, count);
  const [tapped, setTapped] = useState(null);

  const handleSelect = (chip) => {
    setTapped(chip.text);
    setTimeout(() => {
      onSelect?.(chip.text);
    }, 180);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto px-2"
    >
      {chips.map((chip) => {
        const Icon = chip.icon;
        const isTapped = tapped === chip.text;

        return (
          <motion.button
            key={chip.text}
            variants={chipVariants}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(chip)}
            disabled={isTapped}
            className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: isTapped
                ? `${chip.accent}18`
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${isTapped ? chip.accent + "50" : "rgba(255,255,255,0.10)"}`,
              color: isTapped ? chip.accent : "rgba(255,255,255,0.65)",
              backdropFilter: "blur(8px)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: `0 0 0 1px ${chip.accent}20, 0 4px 20px ${chip.accent}12`,
              }}
            />

            <Icon
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-colors duration-200"
              style={{ color: isTapped ? chip.accent : "rgba(255,255,255,0.45)" }}
            />

            <span className="relative z-10 text-left leading-tight group-hover:text-white/90 transition-colors duration-200">
              {chip.text}
            </span>

            {/* Tap ripple */}
            <AnimatePresence>
              {isTapped && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${chip.accent}30 0%, transparent 70%)` }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
