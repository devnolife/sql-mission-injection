import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Table, Columns, Info } from 'lucide-react';
import clsx from 'clsx';
import { initialData } from '../lib/sqlEngine';

const TableVisualizer = ({ data, tableName, columns, animationState, explanation }) => {

    // SCHEMA DASHBOARD (Shown when no data is active)
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#00f3ff] tracking-[0.2em] mb-2 glow-text-blue">TAMPILAN_SKEMA_SISTEM</h2>
                    <p className="text-[#00f3ff]/50 text-sm font-mono">NODE DATA TERSEDIA TERDETEKSI</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    {Object.entries(initialData).map(([name, rows]) => {
                        const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
                        return (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-black/80 border border-[#00f3ff]/30 rounded-lg p-4 hover:border-[#00f3ff] hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-3 border-b border-[#00f3ff]/20 pb-2">
                                    <Database size={18} className="text-[#00f3ff]" />
                                    <span className="text-lg font-bold text-[#00f3ff] uppercase tracking-wider">{name}</span>
                                    <span className="ml-auto text-xs text-[#00f3ff]/50">{rows.length} REKAMAN</span>
                                </div>
                                <div className="space-y-1">
                                    {cols.map(col => (
                                        <div key={col} className="flex items-center gap-2 text-xs text-slate-400 font-mono px-2 py-1 rounded hover:bg-[#00f3ff]/10">
                                            <div className="w-1.5 h-1.5 bg-[#00f3ff]/50 rounded-full"></div>
                                            {col}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col relative bg-black/20 backdrop-blur-sm rounded-lg border border-[#00f3ff]/10 overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.05)]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#00f3ff]/5 border-b border-[#00f3ff]/20">
                <div className="flex items-center gap-2">
                    <Table size={16} className="text-[#00f3ff]" />
                    <span className="text-xs font-bold text-[#00f3ff] tracking-widest uppercase">
                        NODE_DATA: <span className="text-white">{tableName}</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[#00f3ff]/60 font-mono">
                    <span>BARIS: {data.length}</span>
                    <span>STATUS: <span className="text-[#00ff41]">ONLINE</span></span>
                </div>
            </div>

            {/* Explanation Banner */}
            {explanation && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#00f3ff]/10 border-b border-[#00f3ff]/20 px-4 py-3 flex items-start gap-3"
                >
                    <Info size={16} className="text-[#00f3ff] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-[#00f3ff] font-mono leading-relaxed">
                        <span className="font-bold opacity-50 mr-2">LOG_SISTEM:</span>
                        {explanation}
                    </p>
                </motion.div>
            )}

            {/* Table Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4">
                <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 bg-black/90 z-10 shadow-lg">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="p-3 text-xs font-bold text-[#00f3ff] uppercase tracking-wider border-b border-[#00f3ff]/30 whitespace-nowrap"
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
                        <AnimatePresence mode='wait'>
                            {data.map((row, rowIndex) => (
                                <motion.tr
                                    key={rowIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: rowIndex * 0.05, duration: 0.2 }}
                                    className="hover:bg-[#00f3ff]/5 transition-colors group border-b border-[#00f3ff]/10 last:border-0"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-3 text-slate-300 border-r border-[#00f3ff]/5 last:border-0">
                                            {animationState && animationState.rowIndex === rowIndex && animationState.colIndex === colIndex ? (
                                                <span className="bg-[#00ff41] text-black px-1 animate-pulse">
                                                    {row[col]}
                                                </span>
                                            ) : (
                                                <span className="group-hover:text-[#00f3ff] transition-colors">
                                                    {row[col]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Grid Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
        </div>
    );
};

export default TableVisualizer;
