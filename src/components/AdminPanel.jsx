import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Copy, Check, RefreshCw, Trash2, Eye,
    Trophy, BookOpen, Clock, ChevronLeft, X, User,
    Shield, Key, Clipboard, CheckCircle, AlertCircle, LogOut, Home, Lock
} from 'lucide-react';
import { getAllUsers, registerUser, loginUser } from '../lib/apiClient';
import { lessons } from '../lib/lessons';

// Admin PIN untuk akses panel (bisa diubah)
const ADMIN_PIN = 'admin123';

// Generate random password
const generatePassword = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (pin === ADMIN_PIN) {
                localStorage.setItem('admin_authenticated', 'true');
                onLogin();
            } else {
                setError('PIN salah!');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm"
            >
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                            <Shield size={28} className="text-cyan-400" />
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">Admin Panel</h1>
                        <p className="text-sm text-slate-400">Masukkan PIN untuk akses</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-400" />
                                <span className="text-xs text-red-400">{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-slate-400 mb-1.5">PIN Admin</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Masukkan PIN"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !pin}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <Shield size={18} />
                            )}
                            {isLoading ? 'Memverifikasi...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                            ← Kembali ke Login Mahasiswa
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Progress Bar Component
const ProgressBar = ({ value, max, color = 'cyan' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const colors = {
        cyan: 'from-cyan-500 to-cyan-400',
        emerald: 'from-emerald-500 to-emerald-400',
        purple: 'from-purple-500 to-purple-400',
    };

    return (
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
            />
        </div>
    );
};

// User Card Component
const UserCard = ({ user, onViewDetails }) => {
    const totalLessons = lessons.length;
    const progressPercentage = Math.round((user.completedLessons / totalLessons) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/30 transition-all group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <User size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">{user.displayName || user.username}</h3>
                        <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
                    </div>
                </div>
                <button
                    onClick={() => onViewDetails(user)}
                    className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Eye size={16} className="text-cyan-400" />
                </button>
            </div>

            <div className="space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <Trophy size={12} className="text-amber-400" />
                            Points
                        </div>
                        <p className="font-bold text-amber-400">{user.totalPoints}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <BookOpen size={12} className="text-emerald-400" />
                            Lessons
                        </div>
                        <p className="font-bold text-emerald-400">{user.completedLessons}/{totalLessons}</p>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <ProgressBar value={user.completedLessons} max={totalLessons} />
                </div>

                {/* Last Login */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={10} />
                    {user.lastLoginAt
                        ? `Login terakhir: ${new Date(user.lastLoginAt).toLocaleDateString('id-ID')}`
                        : 'Belum pernah login'
                    }
                </div>
            </div>
        </motion.div>
    );
};

// Create User Modal
const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState(generatePassword());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await registerUser(username, password, displayName);

        if (result.success) {
            setSuccess({ username, password, displayName });
            onUserCreated();
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleCopyCredentials = () => {
        const text = `Username: ${success.username}\nPassword: ${success.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setUsername('');
        setDisplayName('');
        setPassword(generatePassword());
        setError('');
        setSuccess(null);
        onClose();
    };

    const handleGeneratePassword = () => {
        setPassword(generatePassword());
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Plus size={18} className="text-cyan-400" />
                            </div>
                            <h2 className="font-bold text-white">Buat User Baru</h2>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={18} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {success ? (
                            // Success State
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} className="text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">User Berhasil Dibuat!</h3>
                                <p className="text-sm text-slate-400 mb-6">Simpan kredensial berikut untuk mahasiswa:</p>

                                <div className="bg-slate-800 rounded-xl p-4 text-left mb-4 font-mono text-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400">Username:</span>
                                        <span className="text-cyan-400">{success.username}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Password:</span>
                                        <span className="text-emerald-400">{success.password}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCopyCredentials}
                                    className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-cyan-400" />}
                                    <span className="text-sm font-bold text-cyan-400">
                                        {copied ? 'Tersalin!' : 'Copy Kredensial'}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            // Form State
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                                        <AlertCircle size={16} className="text-red-400" />
                                        <span className="text-xs text-red-400">{error}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1.5">Username (untuk login)</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                            placeholder="contoh: mahasiswa01"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1.5">Nama Lengkap</label>
                                    <div className="relative">
                                        <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="contoh: Ahmad Sudrajat"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1.5">Password (otomatis)</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                value={password}
                                                readOnly
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-emerald-400 font-mono focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleGeneratePassword}
                                            className="p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                                        >
                                            <RefreshCw size={16} className="text-slate-400" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !username}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <RefreshCw size={18} className="animate-spin" />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                    {isLoading ? 'Membuat...' : 'Buat User'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// User Details Modal
const UserDetailsModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    const totalLessons = lessons.length;
    const progressPercentage = Math.round((user.completedLessons / totalLessons) * 100);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/30 flex items-center justify-center">
                                <User size={24} className="text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-lg">{user.displayName || user.username}</h2>
                                <p className="text-sm text-slate-400 font-mono">@{user.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <Trophy size={20} className="text-amber-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-amber-400">{user.totalPoints}</p>
                                <p className="text-xs text-slate-400">Points</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <BookOpen size={20} className="text-emerald-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-emerald-400">{user.completedLessons}</p>
                                <p className="text-xs text-slate-400">Selesai</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <Target size={20} className="text-cyan-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-cyan-400">{user.activeLessonId}</p>
                                <p className="text-xs text-slate-400">Lesson</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-300">Progress Keseluruhan</span>
                                <span className="text-lg font-bold text-cyan-400">{progressPercentage}%</span>
                            </div>
                            <ProgressBar value={user.completedLessons} max={totalLessons} />
                            <p className="text-xs text-slate-500 mt-2">
                                {user.completedLessons} dari {totalLessons} lessons selesai
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                            <h4 className="text-sm font-bold text-slate-300 mb-3">Informasi</h4>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Dibuat:</span>
                                <span className="text-slate-300">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Login Terakhir:</span>
                                <span className="text-slate-300">
                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('id-ID') : 'Belum pernah'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-medium transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Missing import
const Target = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

// Main Admin Panel Component
export default function AdminPanel({ onBack }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('admin_authenticated') === 'true';
    });
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        setIsAuthenticated(false);
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.users);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    // Show login if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    const totalPoints = users.reduce((sum, u) => sum + u.totalPoints, 0);
    const totalCompletedLessons = users.reduce((sum, u) => sum + u.completedLessons, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={20} className="text-slate-400" />
                                </button>
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-cyan-400" />
                                    Admin Panel
                                </h1>
                                <p className="text-xs text-slate-400">Kelola akun mahasiswa</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchUsers}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={18} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Tambah User</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                                title="Logout Admin"
                            >
                                <LogOut size={18} className="text-slate-400 group-hover:text-red-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Users size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{users.length}</p>
                                <p className="text-xs text-slate-400">Total Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Trophy size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalPoints}</p>
                                <p className="text-xs text-slate-400">Total Points</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <BookOpen size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalCompletedLessons}</p>
                                <p className="text-xs text-slate-400">Lessons Selesai</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <BookOpen size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{lessons.length}</p>
                                <p className="text-xs text-slate-400">Total Lessons</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw size={32} className="text-cyan-400 animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20">
                        <Users size={48} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-400 mb-2">Belum ada user</h3>
                        <p className="text-sm text-slate-500 mb-4">Buat user pertama untuk memulai</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl text-cyan-400 font-bold transition-colors"
                        >
                            + Tambah User
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onViewDetails={setSelectedUser}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onUserCreated={fetchUsers}
            />
            <UserDetailsModal
                user={selectedUser}
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </div>
    );
}
