import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, Lock, User } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -45, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-600/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-8"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 mb-4"
                        >
                            <Database size={32} className="text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">SQL Master</h1>
                        <p className="text-slate-400 text-center">Master database queries with interactive visualizations</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    defaultValue="demo_user"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    defaultValue="password"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:shadow-blue-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Start Learning <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
