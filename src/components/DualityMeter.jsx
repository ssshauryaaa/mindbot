import React, { useState, useEffect, useRef, useMemo } from "react";
import { Cpu, Brain, Globe, Zap, Sparkles, ChevronDown } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   PremiumDualityMeter
   A reworked "Machine Logic / Human Context" meter, restyled with
   the flux-loader language: a glowing gradient fill, a moving sheen
   sweep, and a soft ambient pulse — plus real interactivity:
   animated count-up, hover-expandable reasoning, and a live glow
   that tracks whichever side is currently winning.
   ──────────────────────────────────────────────────────────────── */

const PROVIDER_META = {
    openrouter: { label: "OpenRouter", icon: Globe, color: "emerald" },
    groq: { label: "Groq", icon: Zap, color: "orange" },
    grok: { label: "Grok", icon: Zap, color: "amber" },
    gemini: { label: "Gemini", icon: Sparkles, color: "sky" },
};

const COLOR_CLASSES = {
    emerald: "text-emerald-400/90 bg-emerald-400/10 border-emerald-400/20",
    orange: "text-orange-400/90 bg-orange-400/10 border-orange-400/20",
    amber: "text-amber-400/90 bg-amber-400/10 border-amber-400/20",
    sky: "text-sky-400/90 bg-sky-400/10 border-sky-400/20",
};

/** Animates a number toward `target` whenever it changes. */
function useCountUp(target, duration = 700) {
    const [display, setDisplay] = useState(target);
    const fromRef = useRef(target);
    const rafRef = useRef(null);

    useEffect(() => {
        const from = fromRef.current;
        const start = performance.now();
        cancelAnimationFrame(rafRef.current);

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
            setDisplay(from + (target - from) * eased);
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
            else fromRef.current = target;
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    return Math.round(display);
}

function DualityBar({ logicRatio = 50, empathyRatio = 50 }) {
    const logic = useCountUp(logicRatio);
    const empathy = useCountUp(empathyRatio);
    const leaning = logic === empathy ? "balanced" : logic > empathy ? "logic" : "empathy";

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
                <span
                    className={`flex items-center gap-1 transition-colors duration-500 ${leaning === "logic" ? "text-white/95" : "text-white/45"
                        }`}
                >
                    <Cpu className="w-3 h-3" />
                    Machine Logic
                    <span className="tabular-nums font-semibold">{logic}%</span>
                </span>
                <span
                    className={`flex items-center gap-1 transition-colors duration-500 ${leaning === "empathy" ? "text-white/95" : "text-white/45"
                        }`}
                >
                    <span className="tabular-nums font-semibold">{empathy}%</span>
                    Human Context
                    <Brain className="w-3 h-3" />
                </span>
            </div>

            {/* Track */}
            <div
                className="relative h-2.5 w-full rounded-full overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
                }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={logic}
                aria-label="Logic to human-context ratio"
            >
                {/* Logic fill (flux gradient, left) */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out overflow-hidden"
                    style={{
                        width: `${logic}%`,
                        background:
                            "linear-gradient(90deg, #1d6ffb 0%, #4fa8ff 45%, #74e1ff 100%)",
                        boxShadow:
                            "0 0 10px rgba(29,111,251,0.55), 0 0 20px rgba(116,225,255,0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
                    }}
                >
                    <span className="dm-sheen" />
                </div>

                {/* Empathy fill (violet/pink flux, right, grows from the right edge) */}
                <div
                    className="absolute inset-y-0 right-0 rounded-full transition-[width] duration-700 ease-out overflow-hidden"
                    style={{
                        width: `${empathy}%`,
                        background:
                            "linear-gradient(90deg, #f472b6 0%, #c084fc 55%, #a855f7 100%)",
                        boxShadow:
                            "0 0 10px rgba(192,132,252,0.5), 0 0 20px rgba(244,114,182,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                >
                    <span className="dm-sheen dm-sheen-rev" />
                </div>

                {/* Meeting-point glow marker */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[10px] rounded-full bg-white/90 transition-[left] duration-700 ease-out"
                    style={{ left: `calc(${logic}% - 1.5px)`, boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
                />
            </div>
        </div>
    );
}

function ReasoningCard({ icon: Icon, title, text, accent }) {
    const [open, setOpen] = useState(true);
    return (
        <div
            className="group relative rounded-xl text-xs overflow-hidden transition-all duration-300"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <div
                className="absolute inset-x-0 top-0 h-[2px] opacity-70"
                style={{ background: accent }}
            />
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-1.5 px-3 pt-3 pb-1.5 font-mono font-semibold text-white/70 hover:text-white/90 transition-colors"
            >
                <span className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-white/50" />
                    {title}
                </span>
                <ChevronDown
                    className={`w-3 h-3 text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <p className="text-white/60 leading-snug px-3 pb-3">{text}</p>
                </div>
            </div>
        </div>
    );
}

export default function PremiumDualityMeter({
    aiReasoning,
    humanInsight,
    logicRatio,
    empathyRatio,
    provider = "gemini",
    modeName = "Synaptic Duality",
}) {
    const meta = PROVIDER_META[provider] ?? PROVIDER_META.gemini;
    const ProviderIcon = meta.icon;

    const hasMeter = logicRatio !== undefined || empathyRatio !== undefined;
    if (!aiReasoning && !humanInsight) return null;

    return (
        <div className="space-y-2 max-w-3xl mt-2">
            <style>{`
        .dm-sheen {
          position: absolute;
          inset: 0;
          width: 55%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
          mix-blend-mode: screen;
          animation: dm-sweep 2.2s linear infinite;
        }
        .dm-sheen-rev { animation-direction: reverse; }
        @keyframes dm-sweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes dm-fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dm-card { animation: dm-fade-up 0.4s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .dm-sheen { animation: none; }
          .dm-card { animation: none; }
        }
      `}</style>

            {hasMeter && (
                <div
                    className="p-3 rounded-xl space-y-2 transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.05)]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <div className="flex items-center justify-between">
                        <span
                            className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${COLOR_CLASSES[meta.color]}`}
                        >
                            <ProviderIcon className="w-2.5 h-2.5" />
                            {meta.label}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                            {modeName}
                        </span>
                    </div>
                    <DualityBar logicRatio={logicRatio ?? 50} empathyRatio={empathyRatio ?? 50} />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiReasoning && (
                    <div className="dm-card" style={{ animationDelay: "60ms" }}>
                        <ReasoningCard
                            icon={Cpu}
                            title="AI Stream (Logic)"
                            text={aiReasoning}
                            accent="linear-gradient(90deg, #1d6ffb, #74e1ff)"
                        />
                    </div>
                )}
                {humanInsight && (
                    <div className="dm-card" style={{ animationDelay: "140ms" }}>
                        <ReasoningCard
                            icon={Brain}
                            title="Human Context (Empathy)"
                            text={humanInsight}
                            accent="linear-gradient(90deg, #f472b6, #a855f7)"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── demo ────────────────────────────────────────────────────── */

export function Demo() {
    const [msg, setMsg] = useState({
        aiReasoning:
            "Parsed the request into constraints, ran a quick feasibility check, and picked the shortest valid path.",
        humanInsight:
            "The user sounded rushed, so I kept the explanation short and led with the answer they actually needed.",
        logicRatio: 62,
        empathyRatio: 38,
        provider: "gemini",
        modeName: "Synaptic Duality",
    });

    const presets = useMemo(
        () => [
            { logicRatio: 62, empathyRatio: 38, provider: "gemini" },
            { logicRatio: 22, empathyRatio: 78, provider: "groq" },
            { logicRatio: 88, empathyRatio: 12, provider: "openrouter" },
            { logicRatio: 50, empathyRatio: 50, provider: "grok" },
        ],
        []
    );

    return (
        <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl space-y-6">
                <PremiumDualityMeter {...msg} />

                <div className="flex flex-wrap gap-2 pt-4">
                    {presets.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setMsg((m) => ({ ...m, ...p }))}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/70 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-colors"
                        >
                            {p.provider} · {p.logicRatio}/{p.empathyRatio}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}