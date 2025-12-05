'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (email && password) {
                window.location.href = '/';
            } else {
                setError('Please fill in all fields');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-stone-50">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800">
                {/* Decorative Elements */}
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
                            <Sparkles className="w-4 h-4" />
                            Trusted by 10,000+ helpers
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Welcome back to<br />
                            <span className="text-teal-200">HelpRadar</span>
                        </h1>
                        <p className="text-lg text-teal-100/80 max-w-md leading-relaxed">
                            Continue making a difference in your community. Your neighbours are counting on you.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 mt-8">
                        <div>
                            <p className="text-3xl font-bold">5,234</p>
                            <p className="text-teal-200/70 text-sm">People helped</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">892</p>
                            <p className="text-teal-200/70 text-sm">Active requests</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">98%</p>
                            <p className="text-teal-200/70 text-sm">Success rate</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/25">
                                <Heart className="w-5 h-5 text-white" fill="white" />
                            </div>
                            <span className="text-xl font-bold text-stone-900">HelpRadar</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">Sign in to your account</h2>
                        <p className="text-stone-500">
                            New here?{' '}
                            <Link href="/register" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-up">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-800">Authentication failed</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                                Email address
                            </label>
                            <div className={`relative rounded-xl transition-all duration-200 ${focusedField === 'email'
                                ? 'ring-2 ring-teal-500/20'
                                : ''
                                }`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${focusedField === 'email' ? 'bg-teal-100' : 'bg-stone-100'
                                    }`}>
                                    <Mail className={`w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-teal-600' : 'text-stone-400'
                                        }`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full pl-14 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className={`relative rounded-xl transition-all duration-200 ${focusedField === 'password'
                                ? 'ring-2 ring-teal-500/20'
                                : ''
                                }`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${focusedField === 'password' ? 'bg-teal-100' : 'bg-stone-100'
                                    }`}>
                                    <Lock className={`w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-teal-600' : 'text-stone-400'
                                        }`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-12 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="peer sr-only"
                                />
                                <label
                                    htmlFor="remember"
                                    className="flex items-center justify-center w-5 h-5 rounded-md border-2 border-stone-300 bg-white cursor-pointer transition-all peer-checked:bg-teal-600 peer-checked:border-teal-600 peer-focus:ring-2 peer-focus:ring-teal-500/20"
                                >
                                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </label>
                            </div>
                            <label htmlFor="remember" className="text-sm text-stone-600 cursor-pointer select-none">
                                Keep me signed in for 30 days
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-stone-900/10"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-stone-50 text-sm text-stone-400 font-medium">or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-stone-200 rounded-xl text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-stone-400">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-stone-600 hover:text-teal-600 transition-colors">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-stone-600 hover:text-teal-600 transition-colors">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
