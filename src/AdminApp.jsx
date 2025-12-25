import React, { useState } from 'react';
import { lessons as initialLessons } from './lib/lessons';
import { Save, Plus, Trash2, Copy, Check, Lock, LogOut, Edit3, FileJson } from 'lucide-react';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [lessons, setLessons] = useState(initialLessons);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simple PIN authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Akses Ditolak');
    }
  };

  // CRUD Operations
  const handleSaveLesson = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLesson = {
      id: selectedLesson ? selectedLesson.id : lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1,
      title: formData.get('title'),
      section: formData.get('section'),
      description: formData.get('description'),
      briefing: formData.get('briefing'),
      query: formData.get('query'),
      points: parseInt(formData.get('points'), 10),
    };

    if (selectedLesson) {
      setLessons(lessons.map(l => l.id === selectedLesson.id ? newLesson : l));
    } else {
      setLessons([...lessons, newLesson]);
    }
    setSelectedLesson(null);
    setIsEditing(false);
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelajaran ini?')) {
      setLessons(lessons.filter(l => l.id !== id));
      if (selectedLesson && selectedLesson.id === id) {
        setSelectedLesson(null);
        setIsEditing(false);
      }
    }
  };

  const handleExport = () => {
    const data = `export const lessons = ${JSON.stringify(lessons, null, 4)};`;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-6">Akses Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">PIN Keamanan</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition-all"
                placeholder="Masukkan PIN"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
            >
              Buka Kunci Sistem
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-gray-100">
      {/* Header - Dark Glassmorphism */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Kontrol Misi</h1>
            <p className="text-sm text-slate-400">Manajer Konfigurasi Pelajaran</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Disalin ke Papan Klip' : 'Ekspor Konfig'}
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/30 transition-all duration-300"
            title="Keluar"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List - Modern Glassmorphism Design */}
        <aside className="w-80 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-cyan-500/20 overflow-y-auto flex flex-col shadow-[inset_0_0_60px_rgba(6,182,212,0.05)]">
          {/* Sidebar Header with Gradient */}
          <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10">
            <button
              onClick={() => {
                setSelectedLesson(null);
                setIsEditing(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-cyan-400/50 rounded-xl text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold tracking-wide">Misi Baru</span>
            </button>
          </div>

          {/* Mission Items List */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson);
                  setIsEditing(false);
                }}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${selectedLesson?.id === lesson.id
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-cyan-500/20 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-800/50 hover:bg-slate-700/50 border border-transparent hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  }`}
              >
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${selectedLesson?.id === lesson.id
                      ? 'bg-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-700/80 text-cyan-400 group-hover:bg-cyan-500/20'
                      } transition-all duration-300`}>
                      #{lesson.id}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedLesson?.id === lesson.id
                      ? 'text-purple-300 bg-purple-500/20'
                      : 'text-slate-400 group-hover:text-purple-300'
                      } transition-all duration-300`}>
                      ⚡ {lesson.points} poin
                    </span>
                  </div>
                  <h3 className={`font-semibold truncate mb-1 transition-colors duration-300 ${selectedLesson?.id === lesson.id
                    ? 'text-white'
                    : 'text-slate-200 group-hover:text-white'
                    }`}>
                    {lesson.title}
                  </h3>
                  <p className={`text-xs truncate transition-colors duration-300 ${selectedLesson?.id === lesson.id
                    ? 'text-cyan-300/70'
                    : 'text-slate-500 group-hover:text-cyan-400/60'
                    }`}>
                    {lesson.section}
                  </p>
                </div>

                {/* Active indicator line */}
                {selectedLesson?.id === lesson.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Stats */}
          <div className="p-4 border-t border-cyan-500/20 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Misi</span>
              <span className="text-cyan-400 font-bold">{lessons.length}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Dark Theme */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
          {isEditing || selectedLesson ? (
            <div className="max-w-3xl mx-auto bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-cyan-500/20 flex justify-between items-center bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10">
                <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {isEditing ? (selectedLesson ? 'Edit Misi' : 'Buat Misi Baru') : 'Detail Misi'}
                </h2>
                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-1.5 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(selectedLesson.id)}
                      className="px-4 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/30 hover:border-red-400 transition-all duration-300"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveLesson} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyan-400 mb-2">Judul Misi</label>
                      <input
                        name="title"
                        defaultValue={selectedLesson?.title}
                        required
                        className="w-full px-4 py-3 bg-slate-900/80 text-slate-200 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder-slate-500"
                        placeholder="Masukkan judul misi..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cyan-400 mb-2">Bagian / Kategori</label>
                      <input
                        name="section"
                        defaultValue={selectedLesson?.section}
                        required
                        className="w-full px-4 py-3 bg-slate-900/80 text-slate-200 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder-slate-500"
                        placeholder="Contoh: SELECT Basics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">Deskripsi (Singkat)</label>
                    <input
                      name="description"
                      defaultValue={selectedLesson?.description}
                      required
                      className="w-full px-4 py-3 bg-slate-900/80 text-slate-200 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder-slate-500"
                      placeholder="Deskripsi singkat tentang misi..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">Pengarahan Misi (Teks Lengkap)</label>
                    <textarea
                      name="briefing"
                      defaultValue={selectedLesson?.briefing}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900/80 text-slate-200 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all font-mono text-sm placeholder-slate-500"
                      placeholder="Instruksi lengkap untuk misi..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">Query Solusi</label>
                    <div className="relative">
                      <textarea
                        name="query"
                        defaultValue={selectedLesson?.query}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-950 text-green-400 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all font-mono text-sm shadow-inner"
                        placeholder="SELECT * FROM table_name WHERE ...;"
                      />
                      <div className="absolute top-3 right-3 text-xs text-cyan-500 font-bold px-2 py-1 bg-cyan-500/10 rounded">SQL</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">Imbalan Poin</label>
                    <input
                      type="number"
                      name="points"
                      defaultValue={selectedLesson?.points || 10}
                      required
                      className="w-32 px-4 py-3 bg-slate-900/80 text-purple-300 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-cyan-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        if (!selectedLesson) setSelectedLesson(null);
                      }}
                      className="px-5 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-xl border border-transparent hover:border-slate-600 transition-all duration-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    >
                      <Save size={18} />
                      Simpan Misi
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-3">Ikhtisar Misi</h3>
                    <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-600/30">
                      <p className="text-lg text-slate-200">{selectedLesson.description}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-3">Data Pengarahan</h3>
                    <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/20 shadow-inner">
                      <p className="font-mono text-green-400 text-sm leading-relaxed whitespace-pre-wrap">{selectedLesson.briefing}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-3">Solusi Target</h3>
                    <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 shadow-inner flex items-start gap-3">
                      <FileJson className="text-cyan-400 mt-1 shrink-0" size={20} />
                      <code className="font-mono text-cyan-300 text-sm break-all">{selectedLesson.query}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Edit3 size={40} className="text-cyan-500/50" />
              </div>
              <p className="text-lg font-medium text-slate-300">Pilih misi untuk diedit</p>
              <p className="text-sm text-slate-500">atau buat yang baru untuk memperluas kampanye</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
