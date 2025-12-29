import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, ChevronRight, Terminal, Target, Eye, Loader2, CheckCircle } from 'lucide-react';
import { initialData, executeQuery } from '../lib/sqlEngine';

// Sample data for demo
const sampleTableData = {
    users: initialData.users.slice(0, 4),
    products: initialData.products.slice(0, 4),
    orders: initialData.orders.slice(0, 4)
};

// SQL Typing animation component
const SQLTypingAnimation = ({ text, isActive, speed = 40, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const indexRef = useRef(0);

    // Reset state when isActive becomes false or text changes
    useEffect(() => {
        if (!isActive) {
            setDisplayText('');
            indexRef.current = 0;
            return;
        }

        // Reset before starting a new animation
        setDisplayText('');
        indexRef.current = 0;

        const timer = setInterval(() => {
            if (indexRef.current < text.length) {
                // Use substring instead of appending to avoid accumulation
                indexRef.current++;
                setDisplayText(text.substring(0, indexRef.current));
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, isActive, speed, onComplete]);

    return (
        <div className="font-mono text-lg">
            <span className="text-[#00ff41]">{'> '}</span>
            <span className="text-[#00f3ff]">{displayText}</span>
            {isActive && displayText.length < text.length && (
                <span className="inline-block w-2 h-5 bg-[#00f3ff] ml-1 animate-pulse" />
            )}
        </div>
    );
};

// Result display component
const QueryResultDisplay = ({ result, isVisible }) => {
    if (!isVisible || !result) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 border border-[#00ff41]/30 rounded-lg overflow-hidden"
        >
            <div className="bg-[#00ff41]/10 px-3 py-2 text-xs text-[#00ff41] font-bold tracking-widest flex items-center gap-2">
                <CheckCircle size={14} />
                HASIL EKSEKUSI
            </div>
            <div className="overflow-x-auto max-h-40">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#00f3ff]/10">
                            {result.columns.map((col, idx) => (
                                <th key={idx} className="px-3 py-2 text-left text-[#00f3ff] font-bold text-xs uppercase border-b border-[#00f3ff]/20">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {result.data.slice(0, 4).map((row, rowIdx) => (
                            <motion.tr
                                key={rowIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: rowIdx * 0.1 }}
                                className="border-b border-[#00f3ff]/10 hover:bg-[#00f3ff]/5"
                            >
                                {result.columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-3 py-2 text-slate-300 font-mono text-xs">
                                        {row[col]}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-black/50 px-3 py-1 text-[10px] text-slate-500">
                Menampilkan {Math.min(4, result.data.length)} dari {result.data.length} baris
            </div>
        </motion.div>
    );
};

/**
 * QueryMission Component
 * Shows animated demo before user attempts the query mission
 */
const QueryMission = ({ lesson, onComplete, onStartChallenge }) => {
    const [phase, setPhase] = useState('demo'); // 'demo' | 'challenge'
    const [demoStep, setDemoStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [demoResult, setDemoResult] = useState(null);
    const [demoComplete, setDemoComplete] = useState(false);

    const exampleDemo = lesson.exampleDemo;
    const hasDemo = exampleDemo && exampleDemo.exampleQuery;

    // Reset all state when lesson changes
    useEffect(() => {
        setPhase('demo');
        setDemoStep(0);
        setIsTyping(false);
        setShowResult(false);
        setDemoResult(null);
        setDemoComplete(false);
    }, [lesson.id]);

    // Auto-start demo
    useEffect(() => {
        if (hasDemo && phase === 'demo') {
            const timer = setTimeout(() => {
                startDemo();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasDemo, phase, lesson.id]);

    const startDemo = () => {
        setDemoStep(1); // Show table
        setTimeout(() => {
            setDemoStep(2); // Start typing
            setIsTyping(true);
        }, 1500);
    };

    const handleTypingComplete = () => {
        setIsTyping(false);
        // Execute demo query
        const result = executeQuery(exampleDemo.exampleQuery, initialData);
        if (!result.error) {
            setDemoResult(result);
            setShowResult(true);
        }
        setTimeout(() => {
            setDemoComplete(true);
        }, 1000);
    };

    const handleStartChallenge = () => {
        setPhase('challenge');
        if (onStartChallenge) onStartChallenge();
    };

    // Get table data for demo
    const tableName = exampleDemo?.tableName || 'users';
    const tableData = sampleTableData[tableName] || sampleTableData.users;
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    if (!hasDemo) {
        // No demo, go straight to challenge
        if (onStartChallenge) onStartChallenge();
        return null;
    }

    if (phase === 'challenge') {
        return null; // Parent component will show the SQL editor
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-4xl bg-black/95 border border-[#00f3ff]/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.1)]"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border-b border-amber-500/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Eye size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-amber-400 tracking-wide">
                                CONTOH MISI
                            </h2>
                            <p className="text-xs text-amber-400/60">
                                Perhatikan contoh berikut sebelum mencoba sendiri
                            </p>
                        </div>
                    </div>
                </div>

                {/* Demo Content */}
                <div className="p-6 space-y-6">
                    {/* Mission Info */}
                    <div className="bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={16} className="text-[#00f3ff]" />
                            <span className="text-xs text-[#00f3ff] uppercase tracking-widest font-bold">MISI: {lesson.title}</span>
                        </div>
                        <p className="text-sm text-slate-400">{lesson.description}</p>
                    </div>

                    {/* Example Description */}
                    <div className="text-sm text-[#00ff41] font-mono flex items-center gap-2">
                        <span className="text-[#00ff41]/50">{'>'}</span>
                        {exampleDemo.description || 'Perhatikan contoh query berikut:'}
                    </div>

                    {/* Demo Table */}
                    <AnimatePresence>
                        {demoStep >= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-[#00f3ff]/30 rounded-lg overflow-hidden"
                            >
                                <div className="bg-[#00f3ff]/10 px-4 py-2 flex items-center gap-2">
                                    <Database size={14} className="text-[#00f3ff]" />
                                    <span className="text-xs text-[#00f3ff] font-bold tracking-widest">
                                        TABEL: {tableName.toUpperCase()}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#00f3ff]/5">
                                                {columns.map((col, idx) => (
                                                    <th key={idx} className="px-4 py-2 text-left text-[#00f3ff] font-bold text-xs uppercase border-b border-[#00f3ff]/20">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, rowIdx) => (
                                                <motion.tr
                                                    key={rowIdx}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: rowIdx * 0.1 }}
                                                    className="border-b border-[#00f3ff]/10"
                                                >
                                                    {columns.map((col, colIdx) => (
                                                        <td key={colIdx} className="px-4 py-2 text-slate-300 font-mono text-xs">
                                                            {typeof row[col] === 'number' ? row[col].toLocaleString() : row[col]}
                                                        </td>
                                                    ))}
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SQL Query Demo */}
                    <AnimatePresence>
                        {demoStep >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black border border-[#00ff41]/30 rounded-lg p-4"
                            >
                                <div className="text-xs text-[#00ff41]/60 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Terminal size={12} />
                                    Contoh Query SQL
                                </div>
                                <SQLTypingAnimation
                                    text={exampleDemo.exampleQuery}
                                    isActive={isTyping}
                                    speed={35}
                                    onComplete={handleTypingComplete}
                                />

                                {/* Query Result */}
                                <QueryResultDisplay result={demoResult} isVisible={showResult} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-black/50 border-t border-[#00f3ff]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        {!demoComplete ? (
                            <>
                                <Loader2 size={14} className="animate-spin text-amber-400" />
                                <span>Menampilkan demo...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={14} className="text-emerald-400" />
                                <span className="text-emerald-400">Demo selesai - Anda siap mencoba!</span>
                            </>
                        )}
                    </div>

                    <motion.button
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: demoComplete ? 1 : 0.5 }}
                        onClick={handleStartChallenge}
                        disabled={!demoComplete}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all ${demoComplete
                            ? 'bg-[#00ff41] text-black hover:bg-[#00ff41]/80 shadow-[0_0_20px_rgba(0,255,65,0.3)]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <Play size={16} />
                        MULAI MISI
                        <ChevronRight size={16} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default QueryMission;
