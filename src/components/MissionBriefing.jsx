import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const MissionBriefing = ({ lesson, onAccept, isOpen }) => {
    if (!lesson) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-2xl bg-black border-2 border-[#00f3ff] shadow-[0_0_50px_rgba(0,243,255,0.2)] relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#00f3ff] text-black p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={24} className="animate-pulse" />
                                <h2 className="text-xl font-bold font-[Orbitron] tracking-widest">TRANSMISI MASUK</h2>
                            </div>
                            <div className="text-xs font-mono font-bold">PRIORITAS: KRITIS</div>
                        </div>

                        {/* Content */}
                        <div className="p-8 font-mono text-[#00f3ff] relative">
                            {/* Scanline */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] z-10 opacity-20"></div>

                            <div className="mb-6 border-b border-[#00f3ff]/30 pb-4">
                                <div className="text-xs text-[#00f3ff]/60 mb-1">ID MISI</div>
                                <div className="text-2xl font-bold tracking-widest">OP-{String(lesson.id).padStart(3, '0')} // {lesson.title.toUpperCase()}</div>
                            </div>

                            <div className="mb-8 space-y-4">
                                <div>
                                    <div className="text-xs text-[#00f3ff]/60 mb-1">PENGARAHAN</div>
                                    <p className="text-lg leading-relaxed text-[#e0e0e0] border-l-4 border-[#00f3ff] pl-4 py-2 bg-[#00f3ff]/5">
                                        {lesson.briefing || "DATA PENGARAHAN TIDAK TERSEDIA."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#00f3ff]/10 p-3 border border-[#00f3ff]/30">
                                        <div className="text-xs text-[#00f3ff]/60 mb-1">TUJUAN</div>
                                        <div className="text-sm text-white">{lesson.description}</div>
                                    </div>
                                    <div className="bg-[#00f3ff]/10 p-3 border border-[#00f3ff]/30">
                                        <div className="text-xs text-[#00f3ff]/60 mb-1">IMBALAN</div>
                                        <div className="text-sm text-[#ff00ff] font-bold">{lesson.points} KREDIT XP</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Action */}
                            <div className="flex justify-end">
                                <button
                                    onClick={onAccept}
                                    className="group relative px-8 py-3 bg-[#00f3ff] text-black font-bold text-lg tracking-widest hover:bg-white transition-colors overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        TERIMA MISI <CheckCircle size={20} />
                                    </span>
                                    <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MissionBriefing;
