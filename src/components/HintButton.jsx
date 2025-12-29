import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Lock, AlertTriangle, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const HintButton = ({ hints = [], userPoints, onUseHint, usedHints = [] }) => {
  const [showHintModal, setShowHintModal] = useState(false);
  const [selectedHintLevel, setSelectedHintLevel] = useState(null);

  // Determine current available hint level
  const currentHintLevel = usedHints.length + 1;
  const currentHint = hints.find(h => h.level === currentHintLevel);
  const allHintsUsed = usedHints.length >= hints.length;

  // Check if user has enough points for the next hint
  const hasEnoughPoints = currentHint ? userPoints >= currentHint.penalty : false;

  const handleHintClick = () => {
    if (allHintsUsed) {
      toast.error('Semua hint sudah digunakan!');
      return;
    }

    if (!hasEnoughPoints) {
      toast.error(`Tidak cukup poin! Butuh ${currentHint.penalty} poin untuk hint ini.`);
      return;
    }

    setSelectedHintLevel(currentHintLevel);
    setShowHintModal(true);
  };

  const handleConfirmHint = () => {
    if (currentHint && hasEnoughPoints) {
      onUseHint(currentHint);
      setShowHintModal(false);
      setSelectedHintLevel(null);
      toast.success(`Hint ${currentHintLevel} digunakan! -${currentHint.penalty} XP`);
    }
  };

  const getHintTypeLabel = (level) => {
    if (level === 1) return 'Hint Ringan';
    if (level === 2) return 'Hint Menengah';
    if (level === 3) return 'Solusi Lengkap';
    return 'Hint';
  };

  const getHintTypeColor = (level) => {
    if (level === 1) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    if (level === 2) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    if (level === 3) return 'text-red-400 border-red-500/50 bg-red-500/10';
    return 'text-[#00f3ff] border-[#00f3ff]/50 bg-[#00f3ff]/10';
  };

  if (!hints || hints.length === 0) {
    return null; // No hints available for this lesson
  }

  return (
    <>
      {/* Hint Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleHintClick}
          disabled={allHintsUsed || !hasEnoughPoints}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-bold transition-all ${
            allHintsUsed
              ? 'bg-gray-500/10 border-gray-500/30 text-gray-500 cursor-not-allowed'
              : !hasEnoughPoints
              ? 'bg-red-500/10 border-red-500/30 text-red-400 cursor-not-allowed'
              : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border-[#00f3ff]/50 text-[#00f3ff]'
          }`}
        >
          {allHintsUsed ? (
            <Lock size={16} />
          ) : !hasEnoughPoints ? (
            <Lock size={16} />
          ) : (
            <Lightbulb size={16} />
          )}
          {allHintsUsed ? (
            'Semua Hint Terpakai'
          ) : !hasEnoughPoints ? (
            `Poin Tidak Cukup (${currentHint?.penalty} XP)`
          ) : (
            <>
              Hint {currentHintLevel}/{hints.length}
              <span className="text-xs opacity-70">(-{currentHint?.penalty} XP)</span>
            </>
          )}
        </button>

        {/* Used Hints Indicator */}
        {usedHints.length > 0 && (
          <div className="flex gap-1">
            {usedHints.map((hint, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full bg-[#00f3ff]"
                title={`Hint ${hint.level} digunakan`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHintModal && currentHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#00f3ff]/30 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getHintTypeColor(currentHint.level)}`}>
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#00f3ff]">
                      {getHintTypeLabel(currentHint.level)}
                    </h3>
                    <p className="text-xs text-[#00f3ff]/60">Level {currentHint.level} dari {hints.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHintModal(false)}
                  className="p-1 hover:bg-[#00f3ff]/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#00f3ff]" />
                </button>
              </div>

              {/* Penalty Warning */}
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-300">
                  <p className="font-bold mb-1">Peringatan Penalti</p>
                  <p className="text-xs text-yellow-300/80">
                    Menggunakan hint ini akan mengurangi <strong>{currentHint.penalty} XP</strong> dari total poin Anda.
                  </p>
                </div>
              </div>

              {/* Hint Content */}
              <div className="mb-6 p-4 bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded-lg">
                <p className="text-sm text-white/90 leading-relaxed font-mono">
                  {currentHint.text}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowHintModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-bold transition-colors"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleConfirmHint}
                  className="flex-1 px-4 py-2 bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-black rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Gunakan Hint <ChevronRight size={16} />
                </button>
              </div>

              {/* Points Check */}
              <div className="mt-4 text-center text-xs text-[#00f3ff]/60">
                Poin Anda saat ini: <strong className="text-[#00f3ff]">{userPoints} XP</strong>
                {' '} → Setelah hint: <strong className="text-yellow-400">{userPoints - currentHint.penalty} XP</strong>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previously Used Hints Display */}
      {usedHints.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-[#00f3ff]/60 font-bold uppercase tracking-wider">Hint yang Sudah Digunakan:</p>
          {usedHints.map((hint, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${getHintTypeColor(hint.level)} text-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{getHintTypeLabel(hint.level)}</span>
                <span className="text-xs opacity-70">-{hint.penalty} XP</span>
              </div>
              <p className="text-xs opacity-80 font-mono">{hint.text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HintButton;
