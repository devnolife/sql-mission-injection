import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Database, Play } from 'lucide-react';
import InteractiveTableLesson from './InteractiveTableLesson';

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
  const [showVisualDemo, setShowVisualDemo] = useState(false);
  const [textComplete, setTextComplete] = useState(false);

  const hasVisualDemo = lesson.visualDemo && lesson.visualDemo.steps && lesson.visualDemo.steps.length > 0;

  // Check if all paragraphs are visible
  useEffect(() => {
    if (visibleCount >= paragraphs.length) {
      setTextComplete(true);
    }
  }, [visibleCount, paragraphs.length]);

  const handleComplete = () => {
    if (hasVisualDemo && !showVisualDemo) {
      setShowVisualDemo(true);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl bg-black/90 border border-[#00f3ff]/30 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)] flex flex-col lg:flex-row overflow-hidden h-[650px]"
      >
        {/* Left Side: Content */}
        <div className={`${showVisualDemo && hasVisualDemo ? 'hidden lg:flex lg:w-2/5' : 'w-full lg:w-1/3'} bg-[#00f3ff]/5 border-r border-[#00f3ff]/20 p-6 flex flex-col relative`}>
          <div className="absolute inset-0 cyber-grid opacity-20"></div>

          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-6 relative z-10">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Database size={60} className="text-[#00f3ff]" />
            </motion.div>
            <h2 className="text-xl font-bold text-[#00f3ff] mb-2">{lesson.title}</h2>
            <div className="w-12 h-1 bg-[#00ff41] mb-2"></div>
            <p className="text-gray-400 text-xs">DASAR DATABASE</p>
          </div>

          {/* Content Text */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-[#00ff41] font-mono text-sm mb-3 flex items-center gap-2">
                <BookOpen size={16} />
                ENTRI_ARSIP_DATA #{lesson.id}
              </h3>
              <div className="text-gray-300 space-y-3 font-mono leading-relaxed text-xs lg:text-sm">
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

          {/* Action Button */}
          {!showVisualDemo && (
            <div className="mt-4 pt-4 border-t border-[#00f3ff]/20 flex justify-end relative z-10">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: visibleCount >= paragraphs.length ? 1 : 0.5 }}
                onClick={handleComplete}
                className="group flex items-center gap-2 bg-[#00f3ff] text-black px-4 py-2 text-sm font-bold tracking-widest hover:bg-[#00c2cc] transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]"
              >
                {hasVisualDemo ? (
                  <>
                    <Play size={16} />
                    <span>LIHAT DEMO</span>
                  </>
                ) : (
                  <>
                    <span>KONFIRMASI</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Right Side: Visual Demo */}
        {hasVisualDemo && (
          <div className={`${showVisualDemo ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
            {showVisualDemo ? (
              <InteractiveTableLesson
                visualDemo={lesson.visualDemo}
                onComplete={onComplete}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-black/50 border-l border-[#00f3ff]/10">
                <div className="text-center p-8">
                  <Database size={48} className="text-[#00f3ff]/30 mx-auto mb-4" />
                  <p className="text-[#00f3ff]/50 text-sm font-mono">
                    Baca materi terlebih dahulu, <br />lalu klik "LIHAT DEMO"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* If no visual demo, show original right panel */}
        {!hasVisualDemo && (
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
        )}
      </motion.div>
    </div>
  );
};

export default ConceptModule;

