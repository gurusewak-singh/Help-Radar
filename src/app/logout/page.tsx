'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, CheckCircle, ArrowRight, Home, LogIn, Shield, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
    const [stage, setStage] = useState<'loading' | 'success'>('loading');
    const [progress, setProgress] = useState(0);
    const { logout } = useAuth();

    useEffect(() => {
        // Actually perform the logout
        logout();

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 4;
            });
        }, 50);

        const timer = setTimeout(() => {
            setStage('success');
        }, 1400);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [logout]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-stone-50">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {stage === 'loading' ? (
                        <div className="text-center animate-fade-up">
                            {/* Logo */}
                            <div className="inline-flex items-center gap-2.5 mb-12">
                                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/25">
                                    <Heart className="w-5 h-5 text-white" fill="white" />
                                </div>
                                <span className="text-xl font-bold text-stone-900">HelpRadar</span>
                            </div>

                            {/* Card */}
                            <div className="bg-white rounded-2xl border border-stone-200 p-10 shadow-sm">
                                {/* Spinner */}
                                <div className="relative w-20 h-20 mx-auto mb-8">
                                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            className="text-stone-100"
                                            strokeWidth="6"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="44"
                                            cx="50"
                                            cy="50"
                                        />
                                        <circle
                                            className="text-teal-600 transition-all duration-100 ease-out"
                                            strokeWidth="6"
                                            strokeDasharray={276.46}
                                            strokeDashoffset={276.46 - (progress / 100) * 276.46}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="44"
                                            cx="50"
                                            cy="50"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-stone-900">{Math.round(progress)}%</span>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold text-stone-900 mb-2">Signing you out</h1>
                                <p className="text-stone-500">Securely ending your session...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center animate-fade-up">
                            {/* Logo */}
                            <div className="inline-flex items-center gap-2.5 mb-12">
                                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/25">
                                    <Heart className="w-5 h-5 text-white" fill="white" />
                                </div>
                                <span className="text-xl font-bold text-stone-900">HelpRadar</span>
                            </div>

                            {/* Success Card */}
                            <div className="bg-white rounded-2xl border border-stone-200 p-10 shadow-sm">
                                {/* Success Icon */}
                                <div className="relative w-20 h-20 mx-auto mb-8">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold text-stone-900 mb-2">You&apos;re signed out</h1>
                                <p className="text-stone-500 mb-8">Thanks for using HelpRadar. See you next time!</p>

                                {/* Actions */}
                                <div className="space-y-2.5">
                                    <Link
                                        href="/login"
                                        className="w-full py-3 px-4 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-stone-900/10"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign back in
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                    <Link
                                        href="/"
                                        className="w-full py-3 px-4 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        Go to home page
                                    </Link>
                                </div>

                                {/* Info Banner */}
                                <div className="mt-8 pt-6 border-t border-stone-100">
                                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3 text-left">
                                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-4 h-4 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-teal-800">Session secured</p>
                                            <p className="text-sm text-teal-700">You can still browse posts without signing in</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Session Info */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-400">
                                <Clock className="w-4 h-4" />
                                <span>Session ended at {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Decorative Panel - Matches Login */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800">
                {/* Decorative */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
                            <Heart className="w-4 h-4" />
                            Until next time
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Thanks for<br />
                            <span className="text-teal-200">helping out</span>
                        </h1>
                        <p className="text-lg text-teal-100/80 max-w-md leading-relaxed">
                            Your contributions make our community stronger every day. Come back soon!
                        </p>
                    </div>

                    {/* Impact Stats */}
                    <div className="space-y-4 mt-8">
                        <p className="text-xs font-semibold text-teal-200/70 uppercase tracking-wider">Your impact this month</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Posts viewed', value: '127' },
                                { label: 'Offers made', value: '8' },
                                { label: 'People helped', value: '12' },
                                { label: 'Days active', value: '23' }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-teal-200/70">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
        </div>
    );
}
