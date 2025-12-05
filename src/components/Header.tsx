'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, Map, Search, Heart } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-white'
            }`}>
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" fill="white" />
                        </div>
                        <span className="text-lg font-semibold text-stone-900 hidden sm:block">HelpRadar</span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-sm mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-stone-100 border-0 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </form>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/map" className="px-3 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                            Map
                        </Link>
                        <Link href="/admin" className="px-3 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                            Admin
                        </Link>
                        <Link
                            href="/create"
                            className="ml-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Request
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-stone-100">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-stone-100 border-0 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </form>
                        <div className="space-y-1">
                            <Link href="/map" className="block px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                Map View
                            </Link>
                            <Link href="/admin" className="block px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                Admin
                            </Link>
                            <Link
                                href="/create"
                                className="block px-4 py-3 text-sm font-medium text-center text-white bg-teal-600 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Post New Request
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
