import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Table, ArrowRight, Play, Pause, RotateCcw, ChevronRight, Columns, Rows } from 'lucide-react';

// Sample data for demo
const sampleTableData = {
    users: [
        { id: 1, name: "Alice", age: 28, job: "Engineer" },
        { id: 2, name: "Bob", age: 34, job: "Designer" },
        { id: 3, name: "Charlie", age: 22, job: "Engineer" },
        { id: 4, name: "David", age: 45, job: "Manager" },
    ]
};

// SQL Typing animation component
const SQLTypingAnimation = ({ text, isActive, speed = 50, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        if (!isActive) {
            setDisplayText('');
            indexRef.current = 0;
            return;
        }

        const timer = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayText(prev => prev + text.charAt(indexRef.current));
                indexRef.current++;
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

// Row/Column Label Component
const StructureLabel = ({ type, position }) => {
    const isRow = type === 'row';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute ${isRow ? '-left-24' : '-top-10'} flex items-center gap-2`}
            style={isRow ? { top: position } : { left: position }}
        >
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isRow
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                }`}>
                {isRow ? <Rows size={12} /> : <Columns size={12} />}
                {isRow ? 'BARIS' : 'KOLOM'}
            </div>
            <motion.div
                animate={{ x: isRow ? [0, 5, 0] : 0, y: isRow ? 0 : [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
            >
                <ArrowRight size={16} className={isRow ? 'text-purple-400' : 'text-emerald-400 rotate-90'} />
            </motion.div>
        </motion.div>
    );
};

const InteractiveTableLesson = ({ visualDemo, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [highlightedColumn, setHighlightedColumn] = useState(null);
    const [showRowLabel, setShowRowLabel] = useState(false);
    const [showColumnLabel, setShowColumnLabel] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Default demo if none provided
    const demo = visualDemo || {
        tableName: "users",
        demoQuery: "SELECT * FROM users",
        steps: [
            { action: "showTable", description: "Ini adalah tabel 'users' yang menyimpan data pengguna" },
            { action: "highlightColumn", column: "name", description: "Setiap KOLOM mewakili satu atribut (contoh: nama)" },
            { action: "highlightRow", row: 0, description: "Setiap BARIS mewakili satu data lengkap (contoh: data Alice)" },
            { action: "runQuery", query: "SELECT name FROM users", description: "Mari jalankan query SQL untuk mengambil kolom 'name'" }
        ]
    };

    const tableData = sampleTableData[demo.tableName] || sampleTableData.users;
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const steps = demo.steps || [];
    const currentStepData = steps[currentStep];

    // Auto-play steps
    useEffect(() => {
        if (!isPlaying || currentStep >= steps.length) {
            setIsPlaying(false);
            return;
        }

        const step = steps[currentStep];

        // Execute step action
        switch (step.action) {
            case 'showTable':
                setHighlightedRow(null);
                setHighlightedColumn(null);
                setShowRowLabel(false);
                setShowColumnLabel(false);
                setQueryResult(null);
                break;
            case 'highlightColumn':
                setHighlightedColumn(step.column);
                setHighlightedRow(null);
                setShowColumnLabel(true);
                setShowRowLabel(false);
                break;
            case 'highlightRow':
                setHighlightedRow(step.row);
                setHighlightedColumn(null);
                setShowRowLabel(true);
                setShowColumnLabel(false);
                break;
            case 'runQuery':
                // Filter or show query result
                if (step.query.toLowerCase().includes('select')) {
                    const cols = step.query.toLowerCase().includes('*')
                        ? columns
                        : columns.filter(c => step.query.toLowerCase().includes(c.toLowerCase()));
                    setQueryResult({ columns: cols, data: tableData });
                    setHighlightedColumn(cols.length === 1 ? cols[0] : null);
                }
                break;
            default:
                break;
        }

        // Auto advance with delay
        const timer = setTimeout(() => {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setIsPlaying(false);
            }
        }, step.action === 'runQuery' ? 4000 : 3000);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps]);

    const handlePlay = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(true);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setHighlightedRow(null);
        setHighlightedColumn(null);
        setShowRowLabel(false);
        setShowColumnLabel(false);
        setQueryResult(null);
        setIsTypingComplete(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            // Trigger the step manually
            const step = steps[currentStep + 1];
            switch (step.action) {
                case 'showTable':
                    setHighlightedRow(null);
                    setHighlightedColumn(null);
                    setShowRowLabel(false);
                    setShowColumnLabel(false);
                    setQueryResult(null);
                    break;
                case 'highlightColumn':
                    setHighlightedColumn(step.column);
                    setHighlightedRow(null);
                    setShowColumnLabel(true);
                    setShowRowLabel(false);
                    break;
                case 'highlightRow':
                    setHighlightedRow(step.row);
                    setHighlightedColumn(null);
                    setShowRowLabel(true);
                    setShowColumnLabel(false);
                    break;
                case 'runQuery':
                    if (step.query.toLowerCase().includes('select')) {
                        const cols = step.query.toLowerCase().includes('*')
                            ? columns
                            : columns.filter(c => step.query.toLowerCase().includes(c.toLowerCase()));
                        setQueryResult({ columns: cols, data: tableData });
                        setHighlightedColumn(cols.length === 1 ? cols[0] : null);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-black/50 rounded-xl border border-[#00f3ff]/30 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#00f3ff]/10 via-purple-500/10 to-[#00f3ff]/10 border-b border-[#00f3ff]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Database size={18} className="text-[#00f3ff]" />
                    <span className="text-sm font-bold text-[#00f3ff] tracking-wider uppercase">
                        DEMO VISUAL: {demo.tableName.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-[#00f3ff]/10 rounded-lg transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={16} className="text-[#00f3ff]" />
                    </button>
                    <button
                        onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                        className="px-4 py-1.5 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff]/50 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        <span className="text-xs font-bold text-[#00f3ff]">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="px-4 py-2 bg-black/50 border-b border-[#00f3ff]/10 flex items-center gap-2">
                {steps.map((_, idx) => (
                    <motion.div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${idx <= currentStep ? 'bg-[#00f3ff]' : 'bg-[#00f3ff]/20'
                            }`}
                        animate={{ scale: idx === currentStep ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: idx === currentStep ? Infinity : 0, duration: 1 }}
                    />
                ))}
            </div>

            {/* Description */}
            <div className="px-4 py-2 bg-[#00f3ff]/5 border-b border-[#00f3ff]/10">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-[#00f3ff] font-mono leading-tight"
                    >
                        <span className="text-[#00f3ff]/50 mr-2">[STEP {currentStep + 1}/{steps.length}]</span>
                        {currentStepData?.description || "Tekan PLAY untuk memulai demo"}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Table Visualization */}
            <div className="flex-1 p-4 overflow-auto">
                <div className="relative inline-block min-w-full">
                    {/* Row Label */}
                    {showRowLabel && highlightedRow !== null && (
                        <StructureLabel type="row" position={`${48 + highlightedRow * 44 + 22}px`} />
                    )}

                    {/* Column Label */}
                    {showColumnLabel && highlightedColumn && (
                        <StructureLabel
                            type="column"
                            position={`${columns.indexOf(highlightedColumn) * 120 + 60}px`}
                        />
                    )}

                    {/* Table */}
                    <table className="border-collapse text-left min-w-full">
                        <thead>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={col}
                                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border border-[#00f3ff]/30 transition-all duration-300 ${highlightedColumn === col
                                                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500'
                                                : 'bg-[#00f3ff]/10 text-[#00f3ff]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Columns size={12} className="opacity-50" />
                                            {col}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {tableData.map((row, rowIdx) => (
                                <motion.tr
                                    key={rowIdx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        scale: highlightedRow === rowIdx ? 1.02 : 1
                                    }}
                                    transition={{ delay: rowIdx * 0.1 }}
                                    className={`transition-all duration-300 ${highlightedRow === rowIdx
                                            ? 'bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                            : 'hover:bg-[#00f3ff]/5'
                                        }`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            className={`px-3 py-2 border border-[#00f3ff]/20 transition-all duration-300 ${highlightedColumn === col
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                                    : highlightedRow === rowIdx
                                                        ? 'text-purple-300 border-purple-500/50'
                                                        : 'text-slate-300'
                                                }`}
                                        >
                                            {row[col]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* SQL Query Animation */}
                {currentStepData?.action === 'runQuery' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-black/80 border border-[#00ff41]/30 rounded-lg"
                    >
                        <div className="text-xs text-[#00ff41]/60 mb-2 uppercase tracking-wider">SQL Query</div>
                        <SQLTypingAnimation
                            text={currentStepData.query}
                            isActive={true}
                            speed={30}
                            onComplete={() => setIsTypingComplete(true)}
                        />
                    </motion.div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="px-4 py-3 bg-black/50 border-t border-[#00f3ff]/20 flex justify-between items-center">
                <span className="text-xs text-[#00f3ff]/50 font-mono">
                    Tekan tombol PLAY atau navigasi manual
                </span>
                <div className="flex gap-2">
                    {currentStep < steps.length - 1 && (
                        <button
                            onClick={handleNext}
                            disabled={isPlaying}
                            className="px-4 py-2 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 rounded-lg flex items-center gap-2 text-xs font-bold text-[#00f3ff] transition-colors disabled:opacity-50"
                        >
                            NEXT <ChevronRight size={14} />
                        </button>
                    )}
                    {currentStep >= steps.length - 1 && onComplete && (
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
        </div>
    );
};

export default InteractiveTableLesson;
