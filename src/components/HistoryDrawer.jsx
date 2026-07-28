import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, X, Search, Clock, Trash2, AlertTriangle, Star, Copy, Check } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   HistoryDrawer — with ⭐ Starred Messages tab
   ──────────────────────────────────────────────────────────────── */

function highlight(text, query) {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-emerald-400/25 text-emerald-200 rounded-[2px] px-0.5">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 340, damping: 30 } },
};

function SessionRow({ session, query, onLoad, onDelete }) {
    const [armed, setArmed] = useState(false);

    const handleDeleteClick = useCallback(
        (e) => {
            e.stopPropagation();
            if (!armed) {
                setArmed(true);
                return;
            }
            onDelete(session.id);
        },
        [armed, onDelete, session.id]
    );

    const snippet = session.messages?.find((m) => m.sender === "user")?.text || "No message snippet";

    return (
        <motion.div
            layout
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            onMouseLeave={() => setArmed(false)}
            whileHover={{ y: -1 }}
            className={`p-3.5 rounded-2xl border transition-colors duration-200 group relative cursor-pointer ${armed
                    ? "bg-red-500/[0.06] border-red-500/30"
                    : "bg-white/[0.04] active:bg-white/[0.08] border-white/10 hover:border-emerald-400/25"
                }`}
            style={{
                boxShadow: armed ? "none" : "0 0 0 rgba(52,211,153,0)",
            }}
            onClick={() => !armed && onLoad(session)}
        >
            {/* soft accent glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 0 1px rgba(52,211,153,0.08), 0 4px 24px rgba(52,211,153,0.06)" }}
            />

            <div className="flex items-start justify-between gap-3 mb-1.5 relative">
                <div className="flex-1 min-w-0">
                    <h3
                        className="text-xs font-semibold text-white/90 group-hover:text-white truncate mb-1"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                        {highlight(session.title || "Untitled Conversation", query)}
                    </h3>
                    <p
                        className="text-[11px] text-white/50 line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        {highlight(snippet, query)}
                    </p>
                </div>

                <button
                    onClick={handleDeleteClick}
                    title={armed ? "Click again to confirm" : "Delete session"}
                    className={`shrink-0 p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${armed
                            ? "opacity-100 bg-red-500/15 text-red-300"
                            : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                        }`}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <AnimatePresence>
                        {armed && (
                            <motion.span
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="text-[10px] font-medium whitespace-nowrap overflow-hidden"
                            >
                                confirm
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[10px] text-white/40 relative">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-white/30" />
                    {session.dateFormatted}
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium text-white/60">
                        {session.messages?.length || 0} msgs
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium capitalize">
                        {session.activeMode || "Duality"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function StarredCard({ msg, onUnstar }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback((e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(msg.text || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [msg.text]);

    const preview = (msg.text || '').replace(/```[\s\S]*?```/g, '[code]').replace(/#{1,6}\s?/g, '').slice(0, 200);

    return (
        <motion.div
            layout
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            whileHover={{ y: -1 }}
            className="p-3.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] group relative"
            style={{ boxShadow: '0 0 0 rgba(251,191,36,0)' }}
        >
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "0 0 0 1px rgba(251,191,36,0.12), 0 4px 24px rgba(251,191,36,0.06)" }}
            />

            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="text-[10px] text-amber-300/70 font-mono">
                        {msg.modeName || 'Synaptic Duality'}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        title="Copy response"
                        className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/08 transition-all cursor-pointer"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onUnstar(msg.id); }}
                        title="Remove from starred"
                        className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-400/10 transition-all cursor-pointer"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <p className="text-[12px] text-white/70 leading-relaxed line-clamp-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {preview}{preview.length >= 200 ? '…' : ''}
            </p>

            {msg.aiReasoning && (
                <div className="mt-2.5 pt-2.5 border-t border-white/[0.06]">
                    <p className="text-[10px] text-white/35 font-mono mb-1">AI Reasoning</p>
                    <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {msg.aiReasoning}
                    </p>
                </div>
            )}

            <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/[0.05] text-[10px] text-white/30">
                <Clock className="w-3 h-3" />
                {msg.time || 'Saved'}
                {msg.logicRatio != null && (
                    <span className="ml-auto flex items-center gap-1">
                        <span className="text-violet-400">⚡{msg.logicRatio}%</span>
                        <span className="opacity-40">/</span>
                        <span className="text-pink-400">🫀{msg.empathyRatio}%</span>
                    </span>
                )}
            </div>
        </motion.div>
    );
}

function ClearAllConfirm({ onConfirm, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs rounded-2xl p-5 bg-[#0c0c11] border border-white/12 shadow-2xl"
            >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Clear all history?</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                    This permanently deletes every saved conversation. This can't be undone.
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-white bg-red-500/90 hover:bg-red-500 transition-colors"
                    >
                        Delete all
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function HistoryDrawer({ isOpen, onClose, sessions, onLoadSession, onDeleteSession, onClearAll, starredMessages = [], onUnstar }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [confirmingClear, setConfirmingClear] = useState(false);
    const [activeTab, setActiveTab] = useState("history"); // "history" | "starred"

    const filteredSessions = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return sessions;
        return sessions.filter((s) => {
            const titleMatch = s.title?.toLowerCase().includes(query);
            const msgMatch = s.messages?.some((m) => m.text?.toLowerCase().includes(query));
            return titleMatch || msgMatch;
        });
    }, [sessions, searchQuery]);

    const handleClearAll = () => {
        onClearAll();
        setConfirmingClear(false);
    };

    const tabs = [
        { id: "history", label: "History", count: sessions.length },
        { id: "starred", label: "Starred", count: starredMessages.length, accent: "#fbbf24" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Glass Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
                    />

                    {/* Responsive Drawer Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="fixed top-0 left-0 bottom-0 z-[201] w-full max-w-full sm:max-w-md bg-[#07070b]/98 sm:bg-[#07070b]/95 border-r border-white/15 backdrop-blur-2xl flex flex-col shadow-2xl safe-top"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ rotate: -8, scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg"
                                >
                                    <Bookmark className="w-4 h-4 text-emerald-400" />
                                </motion.div>
                                <div>
                                    <h2
                                        className="text-sm font-semibold text-white tracking-tight"
                                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                                    >
                                        Conversation History
                                    </h2>
                                    <p className="text-[11px] text-white/50 tabular-nums">
                                        {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                                aria-label="Close History"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 px-4 pt-3 pb-0 shrink-0">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                                    style={{
                                        background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        color: activeTab === tab.id
                                            ? (tab.accent || 'rgba(255,255,255,0.9)')
                                            : 'rgba(255,255,255,0.4)',
                                        border: activeTab === tab.id
                                            ? `1px solid ${tab.accent ? tab.accent + '30' : 'rgba(255,255,255,0.14)'}`
                                            : '1px solid transparent',
                                        fontFamily: 'Space Grotesk, sans-serif',
                                    }}
                                >
                                    {tab.id === 'starred' && (
                                        <Star className="w-3 h-3"
                                            style={{ color: activeTab === tab.id ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}
                                            fill={activeTab === tab.id ? '#fbbf24' : 'none'}
                                        />
                                    )}
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                                            style={{
                                                background: tab.accent ? `${tab.accent}20` : 'rgba(255,255,255,0.1)',
                                                color: tab.accent || 'rgba(255,255,255,0.6)',
                                            }}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar — only on history tab */}
                        <AnimatePresence mode="wait">
                            {activeTab === "history" && (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-3.5 sm:px-4 pt-3 pb-2 border-b border-white/10 overflow-hidden"
                                >
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search past conversations..."
                                            className="w-full bg-white/5 border border-white/10 focus:border-emerald-400/40 focus:bg-white/[0.06] rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
                                            style={{ fontFamily: "Inter, sans-serif" }}
                                        />
                                        <AnimatePresence>
                                            {searchQuery && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.7 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.7 }}
                                                    onClick={() => setSearchQuery("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <AnimatePresence>
                                        {searchQuery && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[10px] text-white/35 mt-1.5 pl-1"
                                            >
                                                {filteredSessions.length} {filteredSessions.length === 1 ? "match" : "matches"}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
                            {activeTab === "history" ? (
                                filteredSessions.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-64 text-center px-4"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                            <Clock className="w-6 h-6 text-white/30" />
                                        </div>
                                        <p className="text-sm font-medium text-white/70 mb-1">
                                            {searchQuery ? "No matching conversations" : "No history yet"}
                                        </p>
                                        <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                                            {searchQuery
                                                ? "Try searching for another keyword"
                                                : "Start a chat session to automatically save your conversation history here."}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-3">
                                        <AnimatePresence mode="popLayout">
                                            {filteredSessions.map((session) => (
                                                <SessionRow
                                                    key={session.id}
                                                    session={session}
                                                    query={searchQuery}
                                                    onLoad={(s) => {
                                                        onLoadSession(s);
                                                        onClose();
                                                    }}
                                                    onDelete={onDeleteSession}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            ) : (
                                // Starred tab
                                starredMessages.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-64 text-center px-4"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-amber-400/[0.06] border border-amber-400/15 flex items-center justify-center mb-3">
                                            <Star className="w-6 h-6 text-amber-400/40" />
                                        </div>
                                        <p className="text-sm font-medium text-white/70 mb-1">No starred responses</p>
                                        <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                                            Click the ⭐ on any AI response to save it here for quick reference.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-3">
                                        <AnimatePresence mode="popLayout">
                                            {starredMessages.map((msg) => (
                                                <StarredCard key={msg.id} msg={msg} onUnstar={onUnstar} />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            )}
                        </div>

                        {/* Footer */}
                        {activeTab === "history" && sessions.length > 0 && (
                            <div className="p-4 border-t border-white/10 flex items-center justify-between pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
                                <button
                                    onClick={() => setConfirmingClear(true)}
                                    className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors cursor-pointer py-1"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear All History
                                </button>
                                <span className="text-[11px] text-white/40">Saved locally</span>
                            </div>
                        )}
                        {activeTab === "starred" && starredMessages.length > 0 && (
                            <div className="p-4 border-t border-white/10 flex items-center justify-end pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
                                <span className="text-[11px] text-white/40">{starredMessages.length} starred response{starredMessages.length !== 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </motion.div>

                    {confirmingClear && (
                        <ClearAllConfirm onConfirm={handleClearAll} onCancel={() => setConfirmingClear(false)} />
                    )}
                </>
            )}
        </AnimatePresence>
    );
}

export default HistoryDrawer;