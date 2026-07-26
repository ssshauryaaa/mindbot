import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, FileSpreadsheet, FileCode, Copy, Check, X, Download } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   UserMessage — premium rework
   - staggered attachment entrance instead of all-at-once
   - image attachments: hover zoom, shimmer while loading, click to
     open a lightbox
   - file attachments: type-aware icon, hover lift
   - text bubble: gradient border glow on hover, copy-to-clipboard
     button that fades in on hover, spring entrance
   ──────────────────────────────────────────────────────────────── */

function fileIconFor(name = "") {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["csv", "xls", "xlsx"].includes(ext)) return FileSpreadsheet;
    if (["js", "jsx", "ts", "tsx", "py", "json", "html", "css"].includes(ext)) return FileCode;
    return FileText;
}

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
};

const attachmentVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.94 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 380, damping: 28 },
    },
};

function ImageAttachment({ att, onOpen }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <motion.div
            variants={attachmentVariants}
            whileHover={{ y: -3 }}
            className="relative flex flex-col gap-1 p-1.5 rounded-2xl cursor-pointer group/att"
            style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
            onClick={() => onOpen(att)}
        >
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                {!loaded && (
                    <div className="absolute inset-0 um-shimmer" aria-hidden="true" />
                )}
                <img
                    src={att.previewUrl}
                    alt={att.name}
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover/att:scale-110 ${loaded ? "opacity-100" : "opacity-0"
                        }`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover/att:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="px-1 py-0.5 flex items-center justify-between gap-1 max-w-[112px]">
                <span
                    className="text-[11px] text-white/80 font-medium truncate"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    {att.name}
                </span>
            </div>
        </motion.div>
    );
}

function FileAttachment({ att }) {
    const Icon = fileIconFor(att.name);
    return (
        <motion.div
            variants={attachmentVariants}
            whileHover={{ y: -2, background: "rgba(255,255,255,0.09)" }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-white/88 transition-colors"
            style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
            }}
        >
            <Icon className="w-4 h-4 text-white/70 shrink-0" />
            <span
                className="truncate max-w-[140px] font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                {att.name}
            </span>
            <span className="text-[10px] text-white/40 font-mono">{att.size}</span>
        </motion.div>
    );
}

function Lightbox({ att, onClose }) {
    if (!att) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-8"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.94, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-3xl max-h-[85vh]"
                >
                    <img
                        src={att.previewUrl}
                        alt={att.name}
                        className="max-w-full max-h-[85vh] rounded-2xl border border-white/15 shadow-2xl object-contain"
                    />
                    <div className="absolute -top-3 -right-3 flex gap-2">
                        <a
                            href={att.previewUrl}
                            download={att.name}
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors"
                            style={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}
                        >
                            <Download className="w-4 h-4" />
                        </a>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors"
                            style={{ background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function UserMessage({ msg }) {
    const [lightboxAtt, setLightboxAtt] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(msg.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            /* clipboard unavailable — ignore */
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-end gap-1.5"
        >
            <style>{`
        @keyframes um-shimmer-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .um-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.04) 100%);
        }
        .um-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: inherit;
          animation: um-shimmer-move 1.3s ease-in-out infinite;
        }
        .um-bubble {
          position: relative;
        }
        .um-bubble::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.25));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .um-bubble:hover::before { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .um-shimmer::after { animation: none; }
        }
      `}</style>

            {msg.attachments && msg.attachments.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-wrap justify-end gap-2.5 max-w-md mb-1"
                >
                    {msg.attachments.map((att, idx) =>
                        att.previewUrl ? (
                            <ImageAttachment key={idx} att={att} onOpen={setLightboxAtt} />
                        ) : (
                            <FileAttachment key={idx} att={att} />
                        )
                    )}
                </motion.div>
            )}

            {msg.text && (
                <div className="group relative max-w-[min(28rem,calc(100vw-2rem))]">
                    <motion.div
                        whileHover={{ y: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="um-bubble text-sm text-white/90 px-4 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            lineHeight: 1.5,
                        }}
                    >
                        {msg.text}
                    </motion.div>

                    <motion.button
                        initial={false}
                        animate={{ opacity: 0 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleCopy}
                        className="absolute -left-9 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white/95"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                        aria-label="Copy message"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {copied ? (
                                <motion.span
                                    key="check"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                >
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="copy"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            )}

            <AnimatePresence>
                {lightboxAtt && <Lightbox att={lightboxAtt} onClose={() => setLightboxAtt(null)} />}
            </AnimatePresence>
        </motion.div>
    );
}

export default UserMessage;