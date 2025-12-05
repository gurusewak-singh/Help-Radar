'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, Search, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';

export default function Header() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
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
            window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleNewRequest = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    const navLinks = [
        { href: '/requests', label: 'Requests' },
        { href: '/map', label: 'Map' },
        { href: '/admin', label: 'Admin' },
    ];

    return (
        <>
            <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${isScrolled ? 'shadow-sm' : ''}`}>
                <nav className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
                            </div>
                            <span className="text-lg font-semibold text-stone-900">HelpRadar</span>
                        </Link>

                        {/* Center: Search */}
                        <div className="hidden md:flex flex-1 justify-center px-8">
                            <form onSubmit={handleSearch} className="w-full max-w-lg">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for help requests..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-stone-100 border-0 rounded-lg placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
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
                                    className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-4 w-px bg-stone-200 mx-2" />

                            {!isLoading && (
                                isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-lg">
                                            <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-stone-700">{user?.name}</span>
                                        </div>
                                        <Link
                                            href="/logout"
                                            className="px-3 py-2 text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all flex items-center gap-1.5"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-all"
                                        >
                                            Log in
                                        </Link>

                                        <Link
                                            href="/register"
                                            className="px-3 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-all"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )
                            )}

                            <Link
                                href="/create"
                                onClick={handleNewRequest}
                                className="flex items-center gap-1.5 h-9 px-4 ml-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                New Request
                            </Link>
                        </div>

                        {/* Mobile: Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 -mr-2 text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Border bottom */}
                <div className="h-px bg-stone-200" />
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-stone-900/50" onClick={() => setIsMenuOpen(false)} />

                    <div className="fixed top-[65px] left-0 right-0 bg-white border-b border-stone-200 shadow-lg">
                        <div className="px-4 py-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-stone-100 border-0 rounded-lg placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-600"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="border-t border-stone-100">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 active:bg-stone-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-stone-100">
                            {isLoggedIn ? (
                                <>
                                    <div className="px-4 py-3 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">{user?.name}</span>
                                    </div>
                                    <Link
                                        href="/logout"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-4 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 active:bg-stone-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-4 py-3 text-sm font-medium text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-stone-100">
                            <Link
                                href="/create"
                                className="flex items-center justify-center gap-1.5 w-full h-10 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors"
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
            )}

            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="Please log in or create an account to post a help request."
            />
        </>
    );
}

