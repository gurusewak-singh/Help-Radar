'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, Search, Heart, ChevronDown, User, LogOut } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05),0_1px_2px_-1px_rgb(0,0,0,0.05)] border-b border-stone-100'
                    : 'bg-white border-b border-transparent'
                }`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="relative">
                                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-all duration-300 group-hover:scale-105">
                                    <Heart className="w-4.5 h-4.5 text-white" fill="white" strokeWidth={0} />
                                </div>
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-stone-900 tracking-tight">HelpRadar</span>
                                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 rounded-full" />
                            </div>
                        </Link>

                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
                            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchFocused ? 'text-teal-500' : 'text-stone-400'
                                    }`}>
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search requests, offers, locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-300 ${isSearchFocused
                                            ? 'bg-white border-teal-200 ring-4 ring-teal-500/10 shadow-lg shadow-teal-500/5'
                                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-100/50'
                                        }`}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/map"
                                className="px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-all duration-200"
                            >
                                Map
                            </Link>
                            <Link
                                href="/admin"
                                className="px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-all duration-200"
                            >
                                Admin
                            </Link>

                            {/* Divider */}
                            <div className="w-px h-5 bg-stone-200 mx-2" />

                            {/* Auth Links */}
                            <Link
                                href="/login"
                                className="px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-all duration-200"
                            >
                                Sign up
                            </Link>

                            {/* CTA Button */}
                            <Link
                                href="/create"
                                className="ml-2 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                <span>New Request</span>
                            </Link>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200"
                        >
                            <div className="relative w-5 h-5">
                                <span className={`absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-[9px] rotate-45' : 'top-1'
                                    }`} />
                                <span className={`absolute left-0 top-[9px] block w-5 h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
                                    }`} />
                                <span className={`absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-out ${isMenuOpen ? 'top-[9px] -rotate-45' : 'top-[17px]'
                                    }`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-4 pb-6 pt-2 bg-white border-t border-stone-100">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300 transition-all"
                                />
                            </div>
                        </form>

                        {/* Mobile Nav Links */}
                        <div className="space-y-1">
                            <Link
                                href="/map"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                Map View
                            </Link>
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                Admin Dashboard
                            </Link>

                            {/* Divider */}
                            <div className="my-3 border-t border-stone-100" />

                            <Link
                                href="/login"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-stone-500" />
                                </div>
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-teal-600" />
                                </div>
                                Sign up
                            </Link>

                            {/* CTA */}
                            <div className="pt-3">
                                <Link
                                    href="/create"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Post New Request
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
}
