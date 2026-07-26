import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Brain, Lock } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   DualitySlider
   A premium draggable slider that controls the Logic ↔ Empathy
   ratio. Features:
   - Gradient track with animated sheen
   - Glowing thumb with hover/active pulse
   - Live percentage labels that intensify as they dominate
   - Disabled state when in pure Logic/Empathy mode
   - Fully touch-friendly for mobile
   ──────────────────────────────────────────────────────────────── */

export default function DualitySlider({ value = 50, onChange, disabled = false }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);

  const logicPct = value;
  const empathyPct = 100 - value;

  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  const getValueFromEvent = useCallback((e) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    return clamp(pct);
  }, [value]);

  const handlePointerDown = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    setDragging(true);
    const newVal = getValueFromEvent(e);
    onChange?.(newVal);
  }, [disabled, getValueFromEvent, onChange]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const newVal = getValueFromEvent(e);
      onChange?.(newVal);
    };
    const handleEnd = () => setDragging(false);

    window.addEventListener("mousemove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, getValueFromEvent, onChange]);

  const isActive = dragging || hovering;

  return (
    <div className={`w-full select-none ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <style>{`
        @keyframes ds-sheen {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .ds-sheen {
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: ds-sheen 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ds-thumb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,0.3); }
          50%       { box-shadow: 0 0 0 6px rgba(255,255,255,0.08), 0 0 20px rgba(255,255,255,0.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ds-sheen { animation: none; }
        }
      `}</style>

      {/* Labels */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <motion.span
          animate={{ opacity: logicPct >= 50 ? 0.95 : 0.4, scale: logicPct >= 70 ? 1.03 : 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-semibold"
          style={{ color: `rgba(29, 111, 251, ${0.3 + (logicPct / 100) * 0.7})` }}
        >
          <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Logic</span>
          <motion.span
            key={logicPct}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="tabular-nums text-white/80"
          >
            {logicPct}%
          </motion.span>
        </motion.span>

        {disabled && (
          <span className="flex items-center gap-1 text-[10px] text-white/30 font-mono">
            <Lock className="w-2.5 h-2.5" /> Mode locked
          </span>
        )}

        <motion.span
          animate={{ opacity: empathyPct >= 50 ? 0.95 : 0.4, scale: empathyPct >= 70 ? 1.03 : 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-semibold"
          style={{ color: `rgba(168, 85, 247, ${0.3 + (empathyPct / 100) * 0.7})` }}
        >
          <motion.span
            key={empathyPct}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="tabular-nums text-white/80"
          >
            {empathyPct}%
          </motion.span>
          <span>Empathy</span>
          <Brain className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </motion.span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-3 sm:h-3.5 w-full rounded-full overflow-hidden cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={logicPct}
        aria-label="Logic to empathy ratio"
        tabIndex={0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange?.(clamp(value + 5));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange?.(clamp(value - 5));
          }
        }}
      >
        {/* Logic fill (blue gradient — left side) */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
          animate={{ width: `${logicPct}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: "linear-gradient(90deg, #1d6ffb 0%, #4fa8ff 50%, #74e1ff 100%)",
            boxShadow: isActive
              ? "0 0 14px rgba(29,111,251,0.6), inset 0 1px 0 rgba(255,255,255,0.4)"
              : "0 0 8px rgba(29,111,251,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <span className="ds-sheen" />
        </motion.div>

        {/* Empathy fill (purple/pink gradient — right side) */}
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full overflow-hidden"
          animate={{ width: `${empathyPct}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: "linear-gradient(90deg, #f472b6 0%, #c084fc 55%, #a855f7 100%)",
            boxShadow: isActive
              ? "0 0 14px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
              : "0 0 8px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <span className="ds-sheen" style={{ animationDirection: "reverse" }} />
        </motion.div>

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          animate={{
            left: `calc(${logicPct}% - 9px)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #ffffff, #d4d4d8)",
            border: "2px solid rgba(255,255,255,0.9)",
            boxShadow: dragging
              ? "0 0 0 6px rgba(255,255,255,0.12), 0 0 24px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.4)"
              : "0 0 12px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3)",
            cursor: "grab",
            animation: dragging ? "ds-thumb-pulse 1.2s ease-in-out infinite" : "none",
          }}
        />
      </div>

      {/* Balance indicator text */}
      <AnimatePresence>
        {logicPct >= 45 && logicPct <= 55 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-center text-[10px] text-white/30 font-mono mt-1.5 tracking-wider uppercase"
          >
            ⚖ Balanced Duality
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
