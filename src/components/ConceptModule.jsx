import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Database } from 'lucide-react';

const ConceptModule = ({ lesson, onComplete }) => {
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
          <p className="text-gray-400 text-sm relative z-10">DATABASE FUNDAMENTALS</p>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 flex flex-col relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-[#00ff41] font-mono text-lg mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                DATA_ARCHIVE_ENTRY #{lesson.id}
              </h3>

              <div className="text-gray-300 space-y-4 font-mono leading-relaxed text-sm md:text-base">
                {lesson.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#00f3ff]/20 flex justify-end">
            <button
              onClick={onComplete}
              className="group flex items-center gap-3 bg-[#00f3ff] text-black px-6 py-3 font-bold tracking-widest hover:bg-[#00c2cc] transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
              <span>ACKNOWLEDGE_DATA</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConceptModule;
