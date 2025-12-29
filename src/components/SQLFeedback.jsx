import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, AlertTriangle, ChevronRight, Target } from 'lucide-react';
import clsx from 'clsx';

/**
 * SQLFeedback Component
 * Menampilkan feedback visual untuk query SQL yang salah
 * Menunjukkan bagian yang benar (hijau) dan yang salah (merah) dengan hints
 */
const SQLFeedback = ({ feedback, onClose }) => {
    if (!feedback || feedback.isCorrect) return null;

    const { correctParts, incorrectParts, suggestions } = feedback;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-gradient-to-br from-slate-900/98 via-black/98 to-slate-900/98 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_0_40px_rgba(0,243,255,0.15)] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <AlertTriangle size={20} className="text-amber-400" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0"
                            >
                                <AlertTriangle size={20} className="text-amber-400/30" />
                            </motion.div>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-amber-400 tracking-widest uppercase">
                                Analisis Query
                            </span>
                            <span className="text-xs text-amber-400/60 ml-2">
                                • Perlu Perbaikan
                            </span>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Correct Parts */}
                    {correctParts.length > 0 && (
                        <div className="space-y-2">
                            <div className="text-xs text-emerald-400/70 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} />
                                Bagian yang Benar
                            </div>
                            <div className="space-y-1">
                                {correctParts.map((part, index) => (
                                    <motion.div
                                        key={`correct-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                                    >
                                        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                                        <div className="flex-1">
                                            <span className="text-emerald-400 font-bold text-sm">{part.part}:</span>
                                            <span className="text-emerald-300/80 ml-2 font-mono text-sm">{part.value}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Incorrect Parts */}
                    {incorrectParts.length > 0 && (
                        <div className="space-y-2">
                            <div className="text-xs text-red-400/70 uppercase tracking-widest flex items-center gap-2">
                                <XCircle size={12} />
                                Bagian yang Perlu Diperbaiki
                            </div>
                            <div className="space-y-3">
                                {incorrectParts.map((part, index) => (
                                    <motion.div
                                        key={`incorrect-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (correctParts.length + index) * 0.1 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-lg overflow-hidden"
                                    >
                                        {/* Error Header */}
                                        <div className="flex items-center gap-3 px-3 py-2 border-b border-red-500/10">
                                            <XCircle size={16} className="text-red-400 flex-shrink-0" />
                                            <span className="text-red-400 font-bold text-sm">{part.part}</span>
                                            <span className="text-red-300/60 text-xs ml-auto">{part.message}</span>
                                        </div>

                                        {/* Comparison */}
                                        <div className="px-3 py-2 space-y-2 bg-black/30">
                                            {part.actual && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-red-400/60 text-xs w-20 flex-shrink-0">Anda tulis:</span>
                                                    <code className="text-red-300 font-mono text-sm bg-red-500/10 px-2 py-0.5 rounded line-through">
                                                        {part.actual}
                                                    </code>
                                                </div>
                                            )}
                                            {part.expected && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-emerald-400/60 text-xs w-20 flex-shrink-0">Seharusnya:</span>
                                                    <code className="text-emerald-300 font-mono text-sm bg-emerald-500/10 px-2 py-0.5 rounded">
                                                        {part.expected}
                                                    </code>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hint */}
                                        {part.hint && (
                                            <div className="px-3 py-2 bg-gradient-to-r from-amber-500/5 to-transparent border-t border-amber-500/10 flex items-start gap-2">
                                                <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-amber-300/80 text-xs">{part.hint}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-3"
                        >
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Target size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Saran</span>
                            </div>
                            <ul className="mt-2 space-y-1">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-cyan-300/80">
                                        <ChevronRight size={12} className="text-cyan-500" />
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-black/50 border-t border-cyan-500/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Perbaiki query dan coba lagi
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400/50">
                        <span>CTRL+ENTER</span>
                        <span className="text-slate-600">untuk eksekusi</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SQLFeedback;
