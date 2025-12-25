import React, { useState, useEffect, useCallback } from 'react';
import SQLEditor from './components/SQLEditor';
import TableVisualizer from './components/TableVisualizer';
import LoginPage from './components/LoginPage';
import MissionBriefing from './components/MissionBriefing';
import QuizModule from './components/QuizModule';
import ConceptModule from './components/ConceptModule';
import SQLExecutionOrder from './components/SQLExecutionOrder';
import { initialData, executeQuery } from './lib/sqlEngine';
import { lessons } from './lib/lessons';
import {
  loadAllProgress,
  saveAllProgress,
  saveCompletedLessons,
  saveUserPoints,
  saveActiveLesson,
  saveUserProfile,
  hasExistingProgress,
  resetAllProgress,
  getProgressSummary
} from './lib/progressStore';
import {
  loadProgress as loadProgressAPI,
  saveProgress as saveProgressAPI,
  completeLesson as completeLessonAPI,
  resetProgress as resetProgressAPI,
  checkConnection,
  logQuery,
} from './lib/apiClient';
import { Database, BookOpen, Terminal, LogOut, Lock, CheckCircle, Star, Trophy, Cpu, Shield, Radio, Minimize2, Maximize2, X, ChevronRight, ChevronLeft, User, RotateCcw, Save, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Typewriter = ({ text, speed = 50, delay = 0, className }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let timeoutId;
    const startTyping = () => {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i > text.length) clearInterval(intervalId);
      }, speed);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return <div className={className}>{displayText}</div>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [booting, setBooting] = useState(false);
  const [query, setQuery] = useState("SELECT * FROM users");
  const [activeTable, setActiveTable] = useState("users");
  const [tableData, setTableData] = useState(initialData.users);
  const [animationState, setAnimationState] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [columns, setColumns] = useState([]);
  const [explanation, setExplanation] = useState("");

  // Gamification & Campaign State
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [userPoints, setUserPoints] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState(null);

  // Layout State
  const [missionLogOpen, setMissionLogOpen] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = loadAllProgress();
    if (savedProgress.completedLessons.size > 0) {
      setCompletedLessons(savedProgress.completedLessons);
      setUserPoints(savedProgress.userPoints);
      setActiveLessonId(savedProgress.activeLessonId);
      if (savedProgress.userProfile) {
        setUserProfile(savedProgress.userProfile);
      }
      console.log('📁 Progress dimuat:', savedProgress);
    }
    setProgressLoaded(true);
  }, []);

  // Auto-save when progress changes
  useEffect(() => {
    if (!progressLoaded) return; // Don't save on initial load

    saveCompletedLessons(completedLessons);
    saveUserPoints(userPoints);
    saveActiveLesson(activeLessonId);
    if (userProfile) {
      saveUserProfile(userProfile);
    }

    // Show save indicator briefly
    setShowSaveIndicator(true);
    const timer = setTimeout(() => setShowSaveIndicator(false), 1000);
    return () => clearTimeout(timer);
  }, [completedLessons, userPoints, activeLessonId, progressLoaded]);

  // Reset progress handler
  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin reset semua progress? Ini tidak bisa dibatalkan!')) {
      resetAllProgress();
      setCompletedLessons(new Set());
      setUserPoints(0);
      setActiveLessonId(1);
      setQuery('');
      setTableData([]);
      setExplanation('');
      setShowBriefing(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setBooting(true);
      // Fetch random hacker profile
      fetch('https://randomuser.me/api/?inc=name,picture,login')
        .then(res => res.json())
        .then(data => {
          const user = data.results[0];
          setUserProfile({
            name: user.login.username, // Use username for hacker feel
            avatar: user.picture.medium,
            role: 'NETRUNNER_LVL_1'
          });
        })
        .catch(() => {
          setUserProfile({
            name: 'GHOST_USER',
            avatar: null,
            role: 'UNKNOWN'
          });
        });

      setTimeout(() => {
        setBooting(false);
        setShowBriefing(true); // Show first briefing after boot
      }, 2500);
    }
  }, [isLoggedIn]);

  const handleRun = () => {
    const result = executeQuery(query, initialData);
    if (result.error) {
      // Pass error to visualizer or handle it?
      // For now, alert is okay but we might want a better UI for errors later
      alert(result.error);
      return;
    }

    setActiveTable(result.tableName);
    setTableData(result.data);
    setAnimationState(result.animationState);
    setColumns(result.columns);
    setExplanation(result.explanation);

    const currentLesson = lessons.find(l => l.id === activeLessonId);
    if (currentLesson && !completedLessons.has(currentLesson.id) && currentLesson.query) {
      // Normalize: remove all whitespace, lowercase, remove trailing semicolon
      const normalize = (str) => str.toLowerCase().replace(/\s+/g, '').replace(/;$/, '');
      if (normalize(query) === normalize(currentLesson.query)) {
        completeLesson(currentLesson);
      }
    }
  };

  const completeLesson = (lesson) => {
    setCompletedLessons(prev => new Set(prev).add(lesson.id));
    setUserPoints(prev => prev + lesson.points);
    setShowSuccessModal(true);

    // Auto-advance to next mission briefing after success modal
    setTimeout(() => {
      setShowSuccessModal(false);
      const nextLessonId = lesson.id + 1;
      if (lessons.find(l => l.id === nextLessonId)) {
        setActiveLessonId(nextLessonId);
        setShowBriefing(true);
        setQuery(""); // Clear query for next mission
        setTableData([]); // Clear visualizer
        setExplanation("");
      }
    }, 3000);
  };

  const typeQuery = async (text, lessonId) => {
    if (isTyping) return;

    // Strict Linearity: Can only play active lesson or completed ones
    const isLocked = lessonId > activeLessonId && !completedLessons.has(lessonId);
    if (isLocked) return;

    // If clicking a completed lesson, just load it without briefing
    if (completedLessons.has(lessonId)) {
      setActiveLessonId(lessonId);
      // ... typing logic below
    } else {
      // If it's the current active lesson (and not completed), show briefing
      setActiveLessonId(lessonId);
      setShowBriefing(true);
      return; // Don't auto-type, let them accept mission first
    }

    setIsTyping(true);
    setQuery("");

    if (!text) {
      setIsTyping(false);
      setConsoleOpen(false);
      return;
    }

    setConsoleOpen(true);
    for (let i = 0; i < text.length; i++) {
      await new Promise(r => setTimeout(r, 20));
      setQuery(prev => prev + text[i]);
    }
    setIsTyping(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (booting) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center font-mono text-[#00f3ff] p-8">
        <div className="w-full max-w-md space-y-2">
          <motion.div
            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }}
            className="h-1 bg-[#00f3ff] mb-4 shadow-[0_0_10px_#00f3ff]"
          />
          <Typewriter text="MENGINISIALISASI PROTOKOL NETRUNNER..." speed={30} />
          <Typewriter text="MENGHUBUNGKAN KE MAINFRAME..." speed={30} delay={800} />
          <Typewriter text="MELEWATI FIREWALL..." speed={30} delay={1600} />
          <Typewriter text="AKSES DITERIMA." speed={30} delay={2200} className="text-[#00ff41] font-bold" />
        </div>
      </div>
    );
  }

  const lessonsBySection = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.section]) acc[lesson.section] = [];
    acc[lesson.section].push(lesson);
    return acc;
  }, {});

  return (
    <div className="h-screen bg-black text-[#e0e0e0] font-mono overflow-hidden cyber-grid crt flex">

      {/* Mission Briefing Modal */}
      <MissionBriefing
        lesson={lessons.find(l => l.id === activeLessonId)}
        isOpen={showBriefing}
        onAccept={() => setShowBriefing(false)}
      />

      {/* LEFT SIDEBAR: Mission Log - Enhanced Modern Design */}
      <motion.div
        animate={{ width: missionLogOpen ? 320 : 60 }}
        className="flex-shrink-0 bg-gradient-to-b from-slate-900/95 via-black/95 to-slate-900/95 backdrop-blur-xl border-r border-cyan-400/20 flex flex-col z-20 transition-all duration-300 shadow-[5px_0_30px_rgba(0,243,255,0.1)]"
      >
        {/* Header / User Profile - Enhanced */}
        <div className="p-4 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-12 h-12 rounded-xl border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300" />
              ) : (
                <div className="w-12 h-12 rounded-xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                  <User size={24} className="text-cyan-400" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(0,255,65,0.5)] animate-pulse"></div>
            </div>
            {missionLogOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase">{userProfile?.name || "TIDAK DIKETAHUI"}</span>
                <span className="text-[10px] text-cyan-400/60 tracking-wider font-medium">{userProfile?.role || "INISIASI"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mission List - Enhanced */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
          {missionLogOpen && Object.entries(lessonsBySection).map(([section, sectionLessons]) => (
            <div key={section}>
              <h3 className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-[0.25em] mb-3 px-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse"></div>
                {section}
              </h3>
              <div className="space-y-2">
                {sectionLessons.map((lesson, index) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isLocked = lesson.id > activeLessonId && !completedLessons.has(lesson.id);
                  const isActive = activeLessonId === lesson.id;
                  const title = isLocked ? "DATA_TERENKRIPSI" : lesson.title;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => typeQuery(lesson.query, lesson.id)}
                      disabled={isLocked || isTyping}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 relative group overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_25px_rgba(0,243,255,0.15)]"
                          : isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/50"
                            : "border-transparent hover:bg-cyan-500/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300",
                        isLocked && "opacity-40 cursor-not-allowed hover:bg-transparent hover:border-transparent"
                      )}
                    >
                      {/* Animated gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                      {/* Active indicator line */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
                      )}

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          {isLocked ? (
                            <Lock size={14} className="text-slate-500" />
                          ) : isCompleted ? (
                            <div className="relative">
                              <CheckCircle size={16} className="text-emerald-400" />
                              <div className="absolute inset-0 animate-ping">
                                <CheckCircle size={16} className="text-emerald-400/30" />
                              </div>
                            </div>
                          ) : (
                            <div className={clsx(
                              "w-4 h-4 border-2 rounded transition-all duration-300",
                              isActive ? "border-cyan-400 bg-cyan-400/20 rotate-45" : "border-cyan-500/50 rotate-45 group-hover:border-cyan-400"
                            )} />
                          )}
                          <span className={clsx(
                            "text-[12px] font-semibold tracking-wide truncate max-w-[160px] transition-all duration-300",
                            isLocked && "blur-[2px]",
                            isActive && "text-cyan-200"
                          )}>
                            {title}
                          </span>
                        </div>
                        {!isLocked && (
                          <span className={clsx(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full transition-all duration-300",
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isActive
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-slate-700/50 text-slate-500 group-hover:bg-cyan-500/20 group-hover:text-cyan-400"
                          )}>
                            +{lesson.points}XP
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Toggle - Enhanced */}
        <div className="p-3 border-t border-cyan-400/20 bg-gradient-to-r from-slate-900/80 via-black/80 to-slate-900/80 flex flex-col gap-3">
          {missionLogOpen && (
            <>
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">XP: {userPoints}</span>
                  <span className="text-[9px] text-slate-500">{completedLessons.size}/{lessons.length} Misi Selesai</span>
                </div>
                <div className="flex items-center gap-2">
                  {showSaveIndicator && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full"
                    >
                      <Save size={10} />
                      Tersimpan
                    </motion.div>
                  )}
                  <Radio size={14} className="text-emerald-400 animate-pulse" />
                </div>
              </div>
              {/* Progress Bar - Enhanced */}
              <div className="px-2">
                <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </>
          )}
          <button
            onClick={() => setMissionLogOpen(!missionLogOpen)}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-cyan-500/10 hover:from-cyan-500/20 hover:via-cyan-500/15 hover:to-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            {missionLogOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          {missionLogOpen && (
            <div className="flex gap-2">
              <button
                onClick={handleResetProgress}
                className="flex-1 py-2.5 text-[10px] text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/50 rounded-xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                title="Reset Progress"
              >
                <RotateCcw size={12} />
                Reset
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex-1 py-2.5 text-[10px] text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/50 rounded-xl uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {(() => {
          const currentLesson = lessons.find(l => l.id === activeLessonId);
          if (currentLesson?.type === 'quiz') {
            return <QuizModule lesson={currentLesson} onComplete={() => completeLesson(currentLesson)} />;
          }
          if (currentLesson?.type === 'concept') {
            return <ConceptModule lesson={currentLesson} onComplete={() => completeLesson(currentLesson)} />;
          }
          if (currentLesson?.type === 'execution-order') {
            return (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-full max-w-5xl h-[650px]">
                  <SQLExecutionOrder onComplete={() => completeLesson(currentLesson)} />
                </div>
              </div>
            );
          }
          return (
            <>
              {/* VISUALIZER (Top) */}
              <div className="flex-1 relative overflow-hidden p-4">
                <div className="w-full h-full relative flex flex-col">
                  <TableVisualizer
                    data={tableData}
                    tableName={activeTable}
                    columns={columns}
                    animationState={animationState}
                    explanation={explanation}
                  />
                </div>
              </div>

              {/* CONSOLE (Bottom) */}
              <motion.div
                animate={{ height: consoleOpen ? 300 : 40 }}
                className="flex-shrink-0 bg-black border-t border-[#00f3ff]/50 shadow-[0_-10px_50px_rgba(0,243,255,0.1)] z-30 flex flex-col transition-all duration-300"
              >
                {/* Console Header */}
                <div
                  className="h-10 bg-[#00f3ff]/10 border-b border-[#00f3ff]/30 flex items-center justify-between px-4 cursor-pointer hover:bg-[#00f3ff]/20 transition-colors flex-shrink-0"
                  onClick={() => setConsoleOpen(!consoleOpen)}
                >
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#00f3ff]" />
                    <span className="text-xs font-bold text-[#00f3ff] tracking-widest">KONSOL_PERINTAH_V2.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00f3ff]/50">{consoleOpen ? "MINIMALKAN" : "MAKSIMALKAN"}</span>
                    {consoleOpen ? <Minimize2 size={14} className="text-[#00f3ff]" /> : <Maximize2 size={14} className="text-[#00f3ff]" />}
                  </div>
                </div>

                {/* Console Body */}
                {consoleOpen && (
                  <div className="flex-1 p-0 relative bg-black/90 overflow-hidden">
                    {/* Current Objective Overlay */}
                    <div className="absolute top-0 right-0 p-2 bg-[#00f3ff]/5 border-b border-l border-[#00f3ff]/20 rounded-bl-lg z-10 max-w-md pointer-events-none">
                      <div className="text-[10px] text-[#00f3ff] uppercase tracking-widest mb-1">Arahan Saat Ini</div>
                      <div className="text-xs text-slate-300 font-mono">
                        {lessons.find(l => l.id === activeLessonId)?.description}
                      </div>
                    </div>

                    <SQLEditor query={query} setQuery={setQuery} onRun={handleRun} />
                  </div>
                )}
              </motion.div>
            </>
          );
        })()}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 border-2 border-[#00ff41] p-8 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.3)] text-center"
          >
            <Trophy size={48} className="text-[#00ff41] mx-auto mb-4 glow-text-green" />
            <h2 className="text-2xl font-bold text-[#00ff41] font-[Orbitron] tracking-widest mb-2 glow-text-green">MISI SELESAI</h2>
            <p className="text-[#00ff41]/80 font-mono">Ekstraksi data terkonfirmasi.</p>
            <div className="mt-4 text-sm text-slate-400">IMBALAN XP: <span className="text-white font-bold">{lessons.find(l => l.id === activeLessonId)?.points}</span></div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
