import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const TableVisualizer = ({ data, tableName, columns, animationState, explanation }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-[#00f3ff]/30 p-8">
                <Database size={64} className="mb-4 opacity-20 animate-pulse" />
                <p className="text-sm font-mono tracking-[0.5em] opacity-50">SYSTEM_IDLE</p>
            </div>
        );
    }

    // Determine columns if not provided
    const displayColumns = columns && columns.length > 0
        ? columns
        : Object.keys(data[0]).filter(key => key !== '_joined');

    return (
        <div className="w-full h-full flex flex-col">
            {/* Explanation Banner - Floating */}
            <AnimatePresence mode="wait">
                {explanation && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8 p-4 bg-[#00f3ff]/10 border-l-4 border-[#00f3ff] flex items-start gap-4 max-w-2xl mx-auto backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                    >
                        <Info size={20} className="text-[#00f3ff] mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-[#00f3ff] uppercase tracking-widest mb-1">System Analysis</div>
                            <p className="text-sm text-[#e0e0e0] font-mono leading-relaxed">
                                {explanation}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Holographic Table */}
            <div className="flex-1 overflow-hidden relative">
                {/* Table Header */}
                <div className="flex justify-between items-end mb-2 px-4 border-b border-[#00f3ff]/30 pb-2">
                    <div className="flex items-center gap-3">
                        <Database size={18} className="text-[#00f3ff]" />
                        <span className="text-lg font-bold text-[#00f3ff] uppercase tracking-[0.2em] font-[Orbitron] glow-text-blue">
                            {tableName}
                        </span>
                    </div>
                    <div className="text-xs text-[#00f3ff]/50 font-mono tracking-widest">
                        RECORDS_FOUND: {data.length}
                    </div>
                </div>

                <div className="overflow-auto custom-scrollbar h-full pb-20">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                            <tr className="border-b border-[#00f3ff]/50">
                                {displayColumns.map((col) => (
                                    <th key={col} className="p-4 text-xs font-bold text-[#00f3ff] uppercase tracking-widest font-mono whitespace-nowrap">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            <AnimatePresence mode="popLayout">
                                {data.map((row, index) => {
                                    const rowState = animationState ? animationState.find(s => s.id === row.id) : null;
                                    const isFiltered = rowState && rowState.status === 'filter';

                                    if (isFiltered) return null;

                                    return (
                                        <motion.tr
                                            key={row.id || index}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                            className="border-b border-[#00f3ff]/10 hover:bg-[#00f3ff]/10 transition-colors group"
                                        >
                                            {displayColumns.map((col) => (
                                                <td key={`${row.id}-${col}`} className="p-4 text-slate-400 whitespace-nowrap group-hover:text-[#00f3ff] transition-colors">
                                                    {row[col]}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableVisualizer;
