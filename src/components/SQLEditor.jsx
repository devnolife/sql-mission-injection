import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Play, AlertTriangle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const KEYWORDS = ["SELECT", "FROM", "WHERE", "ORDER BY", "LIMIT", "JOIN", "INNER", "LEFT", "ON", "AND", "OR", "COUNT", "SUM", "AVG", "MAX", "MIN"];
const TABLES = ["users", "products", "orders"];

const SQLEditor = ({ query, setQuery, onRun, isProcessing = false }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const textareaRef = useRef(null);

    const handlePaste = (e) => {
        e.preventDefault();
        // Hacker-style toast notification
        toast.error('⚠️ PERINGATAN KEAMANAN: INPUT OTOMATIS TERDETEKSI.\n\nDiperlukan pengambilalihan manual. Fungsi Salin/Tempel telah dinonaktifkan oleh mainframe.', {
            duration: 6000,
            icon: '⚠️',
            style: {
                whiteSpace: 'pre-line',
                maxWidth: '600px',
            },
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            onRun();
            return;
        }

        if (suggestions.length > 0) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                applySuggestion(suggestions[activeSuggestion]);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => (prev + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === 'Escape') {
                setSuggestions([]);
            }
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        // Simple Auto-complete Logic
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = val.slice(0, cursorPosition);
        const words = textBeforeCursor.split(/\s+/);
        const currentWord = words[words.length - 1];

        if (currentWord.length > 1) {
            const matches = [...KEYWORDS, ...TABLES].filter(k =>
                k.toLowerCase().startsWith(currentWord.toLowerCase())
            );
            setSuggestions(matches.slice(0, 5)); // Limit to 5
            setActiveSuggestion(0);
        } else {
            setSuggestions([]);
        }
    };

    const applySuggestion = (suggestion) => {
        const cursorPosition = textareaRef.current.selectionStart;
        const textBeforeCursor = query.slice(0, cursorPosition);
        const textAfterCursor = query.slice(cursorPosition);
        const words = textBeforeCursor.split(/\s+/);
        const currentWord = words[words.length - 1];

        const newTextBefore = textBeforeCursor.slice(0, -currentWord.length) + suggestion + " ";
        const newQuery = newTextBefore + textAfterCursor;

        setQuery(newQuery);
        setSuggestions([]);

        // Restore focus and cursor (approximate)
        setTimeout(() => {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newTextBefore.length, newTextBefore.length);
        }, 0);
    };

    return (
        <div className="w-full h-full flex flex-col relative group">
            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    className="w-full h-full bg-transparent text-[#00ff41] font-mono p-4 text-lg resize-none focus:outline-none custom-scrollbar leading-relaxed"
                    spellCheck="false"
                    placeholder="// MASUKKAN PERINTAH SQL..."
                />

                {/* Blinking Cursor Effect (Visual only, since textarea has its own) */}
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-50">
                    <div className="w-3 h-5 bg-[#00ff41] animate-pulse inline-block ml-1"></div>
                </div>

                {/* Auto-complete Popup */}
                {suggestions.length > 0 && (
                    <div className="absolute bottom-16 left-4 bg-black border border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)] z-50 min-w-[150px]">
                        <div className="bg-[#00f3ff]/20 text-[#00f3ff] text-[10px] font-bold px-2 py-1 tracking-widest">SARAN</div>
                        {suggestions.map((s, i) => (
                            <div
                                key={s}
                                className={clsx(
                                    "px-3 py-1 text-sm font-mono cursor-pointer hover:bg-[#00f3ff]/20",
                                    i === activeSuggestion ? "bg-[#00f3ff]/30 text-white" : "text-[#00f3ff]/70"
                                )}
                                onClick={() => applySuggestion(s)}
                            >
                                {s}
                            </div>
                        ))}
                        <div className="px-2 py-1 text-[9px] text-slate-500 border-t border-[#00f3ff]/20">TAB untuk menyisipkan</div>
                    </div>
                )}
            </div>

            {/* Run Button (Floating) */}
            <button
                onClick={onRun}
                disabled={isProcessing}
                className={clsx(
                    "absolute bottom-4 right-6 border px-6 py-2 rounded-sm flex items-center gap-2 transition-all group-hover:opacity-100 opacity-80",
                    isProcessing
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/50 cursor-wait"
                        : "bg-[#00ff41]/10 hover:bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                )}
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-bold tracking-widest text-sm">MEMPROSES...</span>
                    </>
                ) : (
                    <>
                        <Play size={16} className="fill-current" />
                        <span className="font-bold tracking-widest text-sm">EKSEKUSI</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SQLEditor;
