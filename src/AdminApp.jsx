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
      alert('Access Denied');
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
    if (window.confirm('Are you sure you want to delete this lesson?')) {
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
          <h1 className="text-2xl font-bold text-center text-white mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Security PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition-all"
                placeholder="Enter PIN"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
            >
              Unlock System
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mission Control</h1>
            <p className="text-sm text-gray-500">Lesson Configuration Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied to Clipboard' : 'Export Config'}
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={() => {
                setSelectedLesson(null);
                setIsEditing(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus size={18} />
              New Mission
            </button>
          </div>
          <div className="flex-1 p-2 space-y-1">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson);
                  setIsEditing(false);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all group ${selectedLesson?.id === lesson.id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'hover:bg-gray-50 border border-transparent'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    #{lesson.id}
                  </span>
                  <span className="text-xs text-gray-400">{lesson.points} pts</span>
                </div>
                <h3 className="font-medium text-gray-900 truncate">{lesson.title}</h3>
                <p className="text-xs text-gray-500 truncate">{lesson.section}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {isEditing || selectedLesson ? (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? (selectedLesson ? 'Edit Mission' : 'Create New Mission') : 'Mission Details'}
                </h2>
                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(selectedLesson.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveLesson} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mission Title</label>
                      <input
                        name="title"
                        defaultValue={selectedLesson?.title}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section / Category</label>
                      <input
                        name="section"
                        defaultValue={selectedLesson?.section}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Short)</label>
                    <input
                      name="description"
                      defaultValue={selectedLesson?.description}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mission Briefing (Full Text)</label>
                    <textarea
                      name="briefing"
                      defaultValue={selectedLesson?.briefing}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Solution Query</label>
                    <div className="relative">
                      <textarea
                        name="query"
                        defaultValue={selectedLesson?.query}
                        required
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-900 text-green-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                      />
                      <div className="absolute top-2 right-2 text-xs text-gray-500 pointer-events-none">SQL</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Reward</label>
                    <input
                      type="number"
                      name="points"
                      defaultValue={selectedLesson?.points || 10}
                      required
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        if (!selectedLesson) setSelectedLesson(null);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Save size={18} />
                      Save Mission
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Mission Overview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-lg text-gray-900">{selectedLesson.description}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Briefing Data</h3>
                    <div className="bg-black p-4 rounded-lg border border-gray-800 shadow-inner">
                      <p className="font-mono text-green-500 text-sm leading-relaxed">{selectedLesson.briefing}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Target Solution</h3>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-inner flex items-start gap-3">
                      <FileJson className="text-blue-400 mt-1 shrink-0" size={20} />
                      <code className="font-mono text-blue-300 text-sm break-all">{selectedLesson.query}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Edit3 size={40} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500">Select a mission to edit</p>
              <p className="text-sm">or create a new one to expand the campaign</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
