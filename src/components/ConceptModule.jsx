import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Database } from 'lucide-react';

const TypewriterBlock = ({ text, onComplete, isActive }) => {
  const [display, setDisplay] = useState('');
  const index = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplay((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 20); // Typing speed
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <span>
      {display}
      {isActive && <span className="inline-block w-2 h-4 bg-[#00f3ff] ml-1 animate-pulse align-middle" />}
    </span>
  );
};

const ConceptModule = ({ lesson, onComplete }) => {
  const paragraphs = lesson.content.split('\n\n');
  const [visibleCount, setVisibleCount] = useState(0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-black/90 border border-[#00f3ff]/30 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)] flex flex-col md:flex-row overflow-hidden h-[600px]"
      >
        {/* Left Side: Visual/Icon */}
        <div className="w-full md:w-1/3 bg-[#00f3ff]/5 border-r border-[#00f3ff]/20 p-8 flex flex-col items-center justify-center text-center relative">
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-6 relative z-10"
          >
            <Database size={80} className="text-[#00f3ff]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#00f3ff] mb-2 relative z-10">{lesson.title}</h2>
          <div className="w-12 h-1 bg-[#00ff41] mb-4 relative z-10"></div>
          <p className="text-gray-400 text-sm relative z-10">DASAR DATABASE</p>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 flex flex-col relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-[#00ff41] font-mono text-lg mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                ENTRI_ARSIP_DATA #{lesson.id}
              </h3>

              <div className="text-gray-300 space-y-4 font-mono leading-relaxed text-sm md:text-base">
                {paragraphs.map((paragraph, idx) => (
                  idx <= visibleCount && (
                    <p key={idx} className="min-h-[1.5em]">
                      {idx < visibleCount ? (
                        paragraph
                      ) : (
                        <TypewriterBlock
                          text={paragraph}
                          isActive={true}
                          onComplete={() => setVisibleCount(prev => prev + 1)}
                        />
                      )}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#00f3ff]/20 flex justify-end">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: visibleCount >= paragraphs.length ? 1 : 0.5 }}
              onClick={onComplete}
              className="group flex items-center gap-3 bg-[#00f3ff] text-black px-6 py-3 font-bold tracking-widest hover:bg-[#00c2cc] transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
              <span>KONFIRMASI_DATA</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConceptModule;
