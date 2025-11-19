import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const QuizModule = ({ lesson, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    const correct = selectedOption === lesson.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      // Play success sound effect here if available
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Play error sound effect here
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-20"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl bg-black/80 border border-[#00f3ff]/30 p-8 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#00f3ff]/20 pb-4">
          <HelpCircle className="text-[#00f3ff]" size={24} />
          <h2 className="text-2xl font-bold text-[#00f3ff] tracking-wider">KNOWLEDGE_CHECK // {lesson.title}</h2>
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-xl text-white font-mono leading-relaxed">
            {lesson.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {lesson.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedOption(index)}
              disabled={isSubmitted}
              className={`
                relative p-4 text-left font-mono text-lg border transition-all duration-300 group
                ${isSubmitted && index === lesson.correctAnswer
                  ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                  : isSubmitted && selectedOption === index && !isCorrect
                    ? 'bg-[#ff0000]/20 border-[#ff0000] text-[#ff0000]'
                    : selectedOption === index
                      ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                      : 'bg-transparent border-[#00f3ff]/30 text-gray-400 hover:border-[#00f3ff] hover:text-[#00f3ff] hover:bg-[#00f3ff]/5'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-4">
                  <span className="text-xs opacity-50 border border-current px-2 py-1 rounded">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>

                {isSubmitted && index === lesson.correctAnswer && (
                  <CheckCircle size={20} className="text-[#00ff41]" />
                )}
                {isSubmitted && selectedOption === index && !isCorrect && (
                  <AlertTriangle size={20} className="text-[#ff0000]" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback & Action */}
        <div className="flex justify-between items-center h-16">
          <div className="flex-1">
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 font-bold tracking-widest ${isCorrect ? 'text-[#00ff41]' : 'text-[#ff0000]'}`}
              >
                {isCorrect ? (
                  <>
                    <Shield size={20} />
                    <span>ACCESS GRANTED. PROCEEDING...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={20} />
                    <span>ACCESS DENIED. INCORRECT PROTOCOL.</span>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`
                px-8 py-3 font-bold tracking-widest transition-all duration-300
                ${selectedOption !== null
                  ? 'bg-[#00f3ff] text-black hover:bg-[#00c2cc] shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              SUBMIT_ANSWER
            </button>
          )}

          {isSubmitted && !isCorrect && (
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedOption(null);
              }}
              className="px-8 py-3 border border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000]/10 font-bold tracking-widest transition-all"
            >
              RETRY_CONNECTION
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizModule;
