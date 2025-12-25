import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

// SQL Execution Order (berbeda dari urutan penulisan!)
const EXECUTION_STEPS = [
    {
        id: 1,
        keyword: 'FROM',
        order: 1,
        description: 'Pertama, database memilih TABEL sumber data',
        example: 'FROM users',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500'
    },
    {
        id: 2,
        keyword: 'JOIN',
        order: 2,
        description: 'Jika ada JOIN, tabel digabungkan di sini',
        example: 'JOIN orders ON users.id = orders.user_id',
        color: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-500/20',
        borderColor: 'border-indigo-500'
    },
    {
        id: 3,
        keyword: 'WHERE',
        order: 3,
        description: 'Filter baris SEBELUM pengelompokan',
        example: 'WHERE age >= 25',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500'
    },
    {
        id: 4,
        keyword: 'GROUP BY',
        order: 4,
        description: 'Kelompokkan baris berdasarkan nilai kolom',
        example: 'GROUP BY department',
        color: 'from-pink-500 to-pink-600',
        bgColor: 'bg-pink-500/20',
        borderColor: 'border-pink-500'
    },
    {
        id: 5,
        keyword: 'HAVING',
        order: 5,
        description: 'Filter grup SETELAH pengelompokan',
        example: 'HAVING COUNT(*) > 2',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500'
    },
    {
        id: 6,
        keyword: 'SELECT',
        order: 6,
        description: 'Pilih kolom yang akan ditampilkan',
        example: 'SELECT name, age, department',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500'
    },
    {
        id: 7,
        keyword: 'DISTINCT',
        order: 7,
        description: 'Hapus baris duplikat (jika ada)',
        example: 'SELECT DISTINCT department',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500'
    },
    {
        id: 8,
        keyword: 'ORDER BY',
        order: 8,
        description: 'Urutkan hasil (ASC/DESC)',
        example: 'ORDER BY age DESC',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500'
    },
    {
        id: 9,
        keyword: 'LIMIT',
        order: 9,
        description: 'Batasi jumlah hasil yang ditampilkan',
        example: 'LIMIT 10',
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500'
    }
];

// Compact step card
const StepCard = ({ step, isActive, isCompleted, showOrder }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
            opacity: 1,
            scale: isActive ? 1.05 : 1,
            y: isActive ? -5 : 0
        }}
        className={`
      relative p-3 rounded-lg border-2 transition-all duration-300
      ${isActive
                ? `${step.bgColor} ${step.borderColor} shadow-lg`
                : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-slate-800/50 border-slate-700/50'}
    `}
    >
        {/* Order badge */}
        <div className={`
      absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
      ${isActive
                ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-400'}
    `}>
            {isCompleted ? <CheckCircle size={12} /> : step.order}
        </div>

        {/* Keyword */}
        <div className={`
      font-mono font-bold text-sm mb-1
      ${isActive
                ? 'text-white'
                : isCompleted
                    ? 'text-emerald-400'
                    : 'text-slate-500'}
    `}>
            {step.keyword}
        </div>

        {/* Description (only show when active) */}
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                >
                    <p className="text-xs text-slate-300">{step.description}</p>
                    <code className="block text-xs bg-black/50 px-2 py-1 rounded text-cyan-400">
                        {step.example}
                    </code>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const SQLExecutionOrder = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    // Auto-play animation
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= EXECUTION_STEPS.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    const handlePlay = () => {
        if (currentStep >= EXECUTION_STEPS.length - 1) {
            setCurrentStep(-1);
        }
        setIsPlaying(true);
        if (currentStep === -1) {
            setCurrentStep(0);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(-1);
        setShowComparison(false);
    };

    // Writing order vs Execution order comparison
    const writingOrder = ['SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
    const executionOrder = ['FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'DISTINCT', 'ORDER BY', 'LIMIT'];

    return (
        <div className="w-full h-full flex flex-col bg-black/90 rounded-xl border border-[#00f3ff]/30 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#00f3ff]/10 via-purple-500/10 to-[#00f3ff]/10 border-b border-[#00f3ff]/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-amber-400" />
                        <div>
                            <h2 className="text-sm font-bold text-[#00f3ff] tracking-wider">
                                URUTAN EKSEKUSI SQL
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                Berbeda dari urutan penulisan!
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="p-2 hover:bg-[#00f3ff]/10 rounded-lg transition-colors"
                        >
                            <RotateCcw size={16} className="text-[#00f3ff]" />
                        </button>
                        <button
                            onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                            className="px-4 py-1.5 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff]/50 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                            <span className="text-xs font-bold text-[#00f3ff]">
                                {isPlaying ? 'PAUSE' : 'PLAY'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 py-2 bg-black/50 border-b border-[#00f3ff]/10">
                <div className="flex gap-1">
                    {EXECUTION_STEPS.map((_, idx) => (
                        <motion.div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-colors ${idx <= currentStep ? 'bg-[#00f3ff]' : 'bg-[#00f3ff]/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 overflow-auto">
                {/* Info banner */}
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-300 font-medium">Tahukah Anda?</p>
                        <p className="text-xs text-slate-400 mt-1">
                            SQL tidak dieksekusi dari kiri ke kanan seperti yang kita tulis.
                            <span className="text-amber-400"> SELECT </span>
                            ditulis pertama tapi dieksekusi hampir terakhir!
                        </p>
                    </div>
                </div>

                {/* Execution steps grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {EXECUTION_STEPS.map((step, idx) => (
                        <StepCard
                            key={step.id}
                            step={step}
                            isActive={currentStep === idx}
                            isCompleted={currentStep > idx}
                        />
                    ))}
                </div>

                {/* Comparison toggle */}
                <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full py-2 text-xs text-[#00f3ff] hover:bg-[#00f3ff]/10 border border-[#00f3ff]/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {showComparison ? 'Sembunyikan' : 'Lihat'} Perbandingan Urutan
                    <ChevronRight size={14} className={`transform transition-transform ${showComparison ? 'rotate-90' : ''}`} />
                </button>

                {/* Comparison section */}
                <AnimatePresence>
                    {showComparison && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 grid grid-cols-2 gap-4"
                        >
                            {/* Writing order */}
                            <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    Urutan Penulisan
                                </h3>
                                <div className="space-y-1">
                                    {writingOrder.map((keyword, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                                            <span className="w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center text-[10px] text-slate-400">
                                                {idx + 1}
                                            </span>
                                            <span className="text-slate-300">{keyword}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Execution order */}
                            <div className="p-3 bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-lg">
                                <h3 className="text-xs font-bold text-[#00f3ff] mb-2 uppercase tracking-wider">
                                    Urutan Eksekusi ✓
                                </h3>
                                <div className="space-y-1">
                                    {executionOrder.map((keyword, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                                            <span className="w-4 h-4 bg-[#00f3ff]/20 rounded-full flex items-center justify-center text-[10px] text-[#00f3ff]">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[#00f3ff]">{keyword}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-black/50 border-t border-[#00f3ff]/20 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                    Step {Math.max(0, currentStep + 1)} / {EXECUTION_STEPS.length}
                </span>
                {currentStep >= EXECUTION_STEPS.length - 1 && onComplete && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={onComplete}
                        className="px-6 py-2 bg-[#00ff41] hover:bg-[#00ff41]/80 text-black font-bold rounded-lg flex items-center gap-2 text-xs transition-colors"
                    >
                        LANJUTKAN <ChevronRight size={14} />
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default SQLExecutionOrder;
