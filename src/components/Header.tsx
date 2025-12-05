'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, Search, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';

export default function Header() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const { user, isLoggedIn, isAdmin, logout, isLoading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/requests?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleNewRequest = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    // Only show Admin link to admins
    const navLinks = [
        { href: '/requests', label: 'Requests' },
        { href: '/map', label: 'Map' },
        ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ease-out ${isScrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-stone-200/50'
                    : 'bg-white border-b border-transparent'
                    }`}
            >
                <nav className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/25 transition-all duration-300 group-hover:shadow-teal-600/40 group-hover:scale-105">
                                    <Heart className="w-4.5 h-4.5 text-white" fill="white" strokeWidth={0} />
                                </div>
                                <div className="absolute -inset-1 bg-teal-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <span className="text-lg font-bold text-stone-800 tracking-tight">HelpRadar</span>
                        </Link>

                        {/* Center: Search */}
                        <div className="hidden md:flex flex-1 justify-center px-8 max-w-xl">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${searchFocused ? 'text-teal-500' : 'text-stone-400'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search for help requests..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className={`w-full h-11 pl-11 pr-4 text-sm bg-stone-100/80 border-2 rounded-xl placeholder-stone-400 focus:outline-none transition-all duration-300 ${searchFocused
                                            ? 'bg-white border-teal-500/50 shadow-lg shadow-teal-500/10'
                                            : 'border-transparent hover:bg-stone-100'
                                            }`}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Right: Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-stone-600 hover:text-teal-600 rounded-lg transition-all duration-300 group"
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    <div className="absolute inset-0 bg-teal-50 rounded-lg scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
                                </Link>
                            ))}

                            <div className="h-5 w-px bg-stone-200 mx-3" />

                            {!isLoading && (
                                isLoggedIn ? (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2.5 px-3 py-1.5 bg-stone-100/80 rounded-full transition-all duration-300 hover:bg-stone-100 hover:scale-[1.02]"
                                        >
                                            <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                                                <User className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-stone-700">{user?.name}</span>
                                        </div>
                                        <Link
                                            href="/logout"
                                            className="px-3 py-2 text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all flex items-center gap-1.5"
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                            title="Logout"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Link>
                                    </>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors duration-300"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all duration-300"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )
                            )}

                            <Link
                                href="/create"
                                onClick={handleNewRequest}
                                className="group flex items-center gap-2 h-10 px-5 ml-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                                New Request
                            </Link>
                        </div>

                        {/* Mobile: Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden relative p-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-5 h-5">
                                <span className={`absolute left-0 top-1 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2.5' : ''}`} />
                                <span className={`absolute left-0 top-2.5 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                                <span className={`absolute left-0 top-4 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2.5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu - Slide from right */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex flex-col h-full">
                        {/* Close button */}
                        <div className="flex justify-end p-4">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-4 mb-4">
                            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-stone-100 border-0 rounded-xl placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Nav Links */}
                        <div className="flex-1 px-2 overflow-y-auto">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between px-4 py-3 text-stone-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300 mb-1"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span className="font-medium">{link.label}</span>
                                    <ChevronRight className="w-4 h-4 opacity-40" />
                                </Link>
                            ))}

                            <div className="h-px bg-stone-100 my-3 mx-4" />

                            {isLoggedIn ? (
                                <>
                                    <div className="px-4 py-3 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-600/25">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-800">{user?.name}</p>
                                            <p className="text-xs text-stone-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/logout"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors"
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                                    >
                                        Log out
                                    </Link>
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-medium">Log out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="px-4 space-y-2">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center py-3 text-stone-700 font-medium hover:bg-stone-100 rounded-xl transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center justify-center py-3 text-teal-600 font-medium bg-teal-50 hover:bg-teal-100 rounded-xl transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Bottom CTA */}
                        <div className="p-4 border-t border-stone-100">
                            <Link
                                href="/create"
                                className="flex items-center justify-center gap-2 w-full h-12 text-white font-semibold bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-300 hover:shadow-teal-600/40"
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                    handleNewRequest(e);
                                }}
                            >
                                <Plus className="w-4 h-4" />
                                Post New Request
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="Please log in or create an account to post a help request."
            />
        </>
    );
}
