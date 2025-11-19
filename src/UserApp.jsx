import React, { useState, useEffect } from 'react';
import SQLEditor from './components/SQLEditor';
import TableVisualizer from './components/TableVisualizer';
import LoginPage from './components/LoginPage';
import MissionBriefing from './components/MissionBriefing';
import QuizModule from './components/QuizModule';
import ConceptModule from './components/ConceptModule';
import { initialData, executeQuery } from './lib/sqlEngine';
import { lessons } from './lib/lessons';
import { Database, BookOpen, Terminal, LogOut, Lock, CheckCircle, Star, Trophy, Cpu, Shield, Radio, Minimize2, Maximize2, X, ChevronRight, ChevronLeft, User } from 'lucide-react';
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
  const [showBriefing, setShowBriefing] = useState(false); // Controls the briefing modal

  // User Profile State
  const [userProfile, setUserProfile] = useState(null);

  // Layout State
  const [missionLogOpen, setMissionLogOpen] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(true);

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
          <Typewriter text="INITIALIZING NETRUNNER PROTOCOL..." speed={30} />
          <Typewriter text="CONNECTING TO MAINFRAME..." speed={30} delay={800} />
          <Typewriter text="BYPASSING FIREWALLS..." speed={30} delay={1600} />
          <Typewriter text="ACCESS GRANTED." speed={30} delay={2200} className="text-[#00ff41] font-bold" />
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

      {/* LEFT SIDEBAR: Mission Log */}
      <motion.div
        animate={{ width: missionLogOpen ? 320 : 60 }}
        className="flex-shrink-0 border-r border-[#00f3ff]/30 bg-black/90 backdrop-blur-md flex flex-col z-20 transition-all duration-300"
      >
        {/* Header / User Profile */}
        <div className="p-4 border-b border-[#00f3ff]/30 bg-[#00f3ff]/5 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-[#00f3ff] bg-[#00f3ff]/20 flex items-center justify-center">
                  <User size={20} className="text-[#00f3ff]" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00ff41] rounded-full border border-black"></div>
            </div>
            {missionLogOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#00f3ff] tracking-widest uppercase">{userProfile?.name || "UNKNOWN"}</span>
                <span className="text-[10px] text-[#00f3ff]/60 tracking-wider">{userProfile?.role || "INITIATE"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mission List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-6">
          {missionLogOpen && Object.entries(lessonsBySection).map(([section, sectionLessons]) => (
            <div key={section}>
              <h3 className="text-[10px] font-bold text-[#00f3ff]/50 uppercase tracking-[0.2em] mb-2 px-2">{section}</h3>
              <div className="space-y-1">
                {sectionLessons.map((lesson) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isLocked = lesson.id > activeLessonId && !completedLessons.has(lesson.id);
                  const isActive = activeLessonId === lesson.id;
                  const title = isLocked ? "ENCRYPTED_DATA" : lesson.title;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => typeQuery(lesson.query, lesson.id)}
                      disabled={isLocked || isTyping}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded border transition-all relative group overflow-hidden",
                        isActive
                          ? "bg-[#00f3ff]/10 border-[#00f3ff] text-[#00f3ff]"
                          : "border-transparent hover:bg-[#00f3ff]/5 hover:border-[#00f3ff]/30 text-slate-400",
                        isLocked && "opacity-30 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isLocked ? <Lock size={12} /> : isCompleted ? <CheckCircle size={12} className="text-[#00ff41]" /> : <div className="w-3 h-3 border border-[#00f3ff] rotate-45" />}
                          <span className={clsx("text-[11px] font-bold tracking-wide truncate max-w-[140px]", isLocked && "blur-[2px]")}>
                            {title}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Toggle */}
        <div className="p-2 border-t border-[#00f3ff]/30 bg-black flex flex-col gap-2">
          {missionLogOpen && (
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] text-[#ff00ff] font-bold">XP: {userPoints}</span>
              <Radio size={14} className="text-[#00ff41] animate-pulse" />
            </div>
          )}
          <button
            onClick={() => setMissionLogOpen(!missionLogOpen)}
            className="w-full py-2 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 rounded flex items-center justify-center transition-colors"
          >
            {missionLogOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          {missionLogOpen && (
            <button onClick={() => setIsLoggedIn(false)} className="w-full py-2 text-[10px] text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/50 uppercase tracking-widest transition-all">
              Disconnect
            </button>
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
                    <span className="text-xs font-bold text-[#00f3ff] tracking-widest">COMMAND_CONSOLE_V2.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00f3ff]/50">{consoleOpen ? "MINIMIZE" : "MAXIMIZE"}</span>
                    {consoleOpen ? <Minimize2 size={14} className="text-[#00f3ff]" /> : <Maximize2 size={14} className="text-[#00f3ff]" />}
                  </div>
                </div>

                {/* Console Body */}
                {consoleOpen && (
                  <div className="flex-1 p-0 relative bg-black/90 overflow-hidden">
                    {/* Current Objective Overlay */}
                    <div className="absolute top-0 right-0 p-2 bg-[#00f3ff]/5 border-b border-l border-[#00f3ff]/20 rounded-bl-lg z-10 max-w-md pointer-events-none">
                      <div className="text-[10px] text-[#00f3ff] uppercase tracking-widest mb-1">Current Directive</div>
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
            <h2 className="text-2xl font-bold text-[#00ff41] font-[Orbitron] tracking-widest mb-2 glow-text-green">MISSION COMPLETE</h2>
            <p className="text-[#00ff41]/80 font-mono">Data extraction confirmed.</p>
            <div className="mt-4 text-sm text-slate-400">XP REWARD: <span className="text-white font-bold">{lessons.find(l => l.id === activeLessonId)?.points}</span></div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
