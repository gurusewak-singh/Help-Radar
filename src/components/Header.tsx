'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Plus, Map, LayoutDashboard, Search, Heart } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                                <Heart className="w-5 h-5 text-white" fill="white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                HelpRadar
                            </h1>
                            <p className="text-[10px] text-purple-300/70 -mt-1">Hyperlocal Community Help</p>
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for help, lost items, blood donors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <Link
                            href="/map"
                            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <Map className="w-4 h-4" />
                            <span>Map View</span>
                        </Link>
                        <Link
                            href="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin</span>
                        </Link>
                        <Link
                            href="/create"
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Post Request</span>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                        </form>
                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/map"
                                className="flex items-center space-x-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Map className="w-5 h-5" />
                                <span>Map View</span>
                            </Link>
                            <Link
                                href="/admin"
                                className="flex items-center space-x-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Admin Panel</span>
                            </Link>
                            <Link
                                href="/create"
                                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Plus className="w-5 h-5" />
                                <span>Post Request</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
