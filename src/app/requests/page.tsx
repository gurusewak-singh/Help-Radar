'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import FiltersBar, { Filters } from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, HelpCircle, Search, Gift, Plus, ChevronRight, Users, Shield, Zap, ArrowLeft } from 'lucide-react';

interface Post {
    _id: string;
    title: string;
    description: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    area?: string;
    urgency: 'Low' | 'Medium' | 'High';
    contact?: { name?: string; phone?: string; email?: string };
    images?: Array<{ url: string }>;
    views: number;
    createdAt: string;
}

interface Stats {
    overview: { totalActive: number; totalViews: number; recentPosts: number; highUrgencyCount: number };
    categoryCounts: Record<string, number>;
}

const MOCK_POSTS: Post[] = [
    { _id: '1', title: 'A+ Blood Donor Urgently Required - City Hospital', description: 'My father needs A+ blood urgently for surgery at City Hospital, Sector 21. Please help if you can donate.', category: 'Blood Needed', city: 'Delhi', area: 'Sector 21', urgency: 'High', contact: { name: 'Rahul Sharma', phone: '9876543210' }, views: 156, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { _id: '2', title: 'Lost Black Wallet Near MG Road Metro Station', description: 'Lost my black leather wallet containing ID cards and some cash near MG Road Metro Station entrance.', category: 'Item Lost', city: 'Bangalore', area: 'MG Road', urgency: 'Medium', contact: { name: 'Priya Patel' }, views: 89, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { _id: '3', title: 'Senior Citizen Needs Grocery Pickup Assistance', description: 'Elderly person living alone needs help with weekly grocery shopping. Cannot travel due to mobility issues.', category: 'Help Needed', city: 'Mumbai', area: 'Andheri West', urgency: 'Medium', contact: { name: 'Meera Aunty' }, views: 234, createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    { _id: '4', title: 'Free Tutoring for Underprivileged Children', description: 'Offering free Math and Science tutoring for children from underprivileged backgrounds. Available on weekends.', category: 'Offer', city: 'Chennai', area: 'T. Nagar', urgency: 'Low', contact: { name: 'Arun Kumar' }, views: 312, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { _id: '5', title: 'O- Blood Needed for Emergency Surgery', description: 'Urgent requirement of O negative blood at Apollo Hospital. Patient is in critical condition.', category: 'Blood Needed', city: 'Hyderabad', area: 'Jubilee Hills', urgency: 'High', contact: { name: 'Dr. Reddy' }, views: 445, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { _id: '6', title: 'Need Volunteers for Flood Relief Work', description: 'Looking for volunteers to help with flood relief distribution in affected areas.', category: 'Help Needed', city: 'Kolkata', area: 'Salt Lake', urgency: 'High', contact: { name: 'NGO Seva' }, views: 567, createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
];

const MOCK_STATS: Stats = { overview: { totalActive: 156, totalViews: 12450, recentPosts: 23, highUrgencyCount: 12 }, categoryCounts: { 'Help Needed': 45, 'Item Lost': 38, 'Blood Needed': 28, 'Offer': 45 } };

const CATEGORIES = [
    { key: 'Blood Needed', label: 'Blood Needed', icon: Heart, iconColor: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { key: 'Help Needed', label: 'Help Needed', icon: HelpCircle, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { key: 'Item Lost', label: 'Lost & Found', icon: Search, iconColor: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    { key: 'Offer', label: 'Offers', icon: Gift, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
];

function RequestsContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        city: searchParams.get('city') || '',
        category: searchParams.get('category') || '',
        urgency: searchParams.get('urgency') || '',
        q: searchParams.get('q') || '',
        sort: searchParams.get('sort') || 'recent'
    });

    // Check if viewing only user's own requests
    const showMine = searchParams.get('mine') === 'true';

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.city) params.set('city', filters.city);
            if (filters.category) params.set('category', filters.category);
            if (filters.urgency) params.set('urgency', filters.urgency);
            if (filters.q) params.set('q', filters.q);
            params.set('sort', filters.sort);
            params.set('page', currentPage.toString());
            params.set('limit', '10');

            // If showing user's own posts, add userEmail filter
            if (showMine && user?.email) {
                params.set('userEmail', user.email);
            }

            const res = await fetch(`/api/posts?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setTotalPages(data.pagination.totalPages);
            } else {
                let filteredPosts = [...MOCK_POSTS];
                if (filters.city) filteredPosts = filteredPosts.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
                if (filters.category) filteredPosts = filteredPosts.filter(p => p.category === filters.category);
                if (filters.urgency) filteredPosts = filteredPosts.filter(p => p.urgency === filters.urgency);
                if (filters.q) { const q = filters.q.toLowerCase(); filteredPosts = filteredPosts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
                // Filter by user email for mock data too
                if (showMine && user?.email) {
                    filteredPosts = filteredPosts.filter(p => p.contact?.email === user.email);
                }
                setPosts(filteredPosts);
                setTotalPages(1);
            }
        } catch { setPosts(showMine ? [] : MOCK_POSTS); setTotalPages(1); }
        finally { setLoading(false); }
    }, [filters, currentPage, showMine, user?.email]);

    const fetchStats = useCallback(async () => {
        try { const res = await fetch('/api/stats'); setStats(res.ok ? await res.json() : MOCK_STATS); }
        catch { setStats(MOCK_STATS); }
    }, []);

    useEffect(() => { fetchPosts(); fetchStats(); }, [fetchPosts, fetchStats]);
    const handleFilterChange = (newFilters: Filters) => { setFilters(newFilters); setCurrentPage(1); };

    return (
        <div className="min-h-screen bg-stone-50 pt-16">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    {showMine && (
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 transition-colors text-sm mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Profile
                        </Link>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900">
                                {showMine ? 'My Requests' : 'All Requests'}
                            </h1>
                            <p className="text-stone-500 mt-1">{loading ? 'Loading...' : `${posts.length} results found`}</p>
                        </div>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Post Request
                        </Link>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => handleFilterChange({ ...filters, category: '' })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!filters.category
                                ? 'bg-teal-600 text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(({ key, label, icon: Icon, iconColor, bgColor, borderColor }) => (
                            <button
                                key={key}
                                onClick={() => handleFilterChange({ ...filters, category: filters.category === key ? '' : key })}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filters.category === key
                                    ? `${bgColor} ${borderColor} border-2 ${iconColor}`
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${filters.category === key ? iconColor : ''}`} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="lg:flex lg:gap-8">
                    {/* Posts Section */}
                    <main className="flex-1 min-w-0">
                        {/* Filters */}
                        <FiltersBar onFilterChange={handleFilterChange} initialFilters={filters} />

                        {/* Posts List */}
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
                                <p className="text-sm text-stone-500 mt-4">Loading requests...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="py-20 text-center bg-white rounded-2xl border border-stone-200">
                                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-7 h-7 text-stone-400" />
                                </div>
                                <p className="text-lg font-semibold text-stone-900 mb-2">No requests found</p>
                                <p className="text-stone-500 mb-6 max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                                <Link href="/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Post the first request
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </main>

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-24 space-y-5">
                            {/* Urgent Banner */}
                            {stats && stats.overview.highUrgencyCount > 0 && (
                                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="text-sm font-bold text-red-700">Urgent Requests</span>
                                    </div>
                                    <p className="text-sm text-red-600 mb-4">
                                        {stats.overview.highUrgencyCount} people need immediate assistance
                                    </p>
                                    <button
                                        onClick={() => handleFilterChange({ ...filters, urgency: 'High' })}
                                        className="w-full py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        View Urgent Requests
                                    </button>
                                </div>
                            )}

                            {/* How It Works */}
                            <div className="bg-white border border-stone-200 rounded-2xl p-5">
                                <h3 className="font-bold text-stone-900 mb-4">How it works</h3>
                                <div className="space-y-4">
                                    {[
                                        { step: 1, title: 'Post your request', desc: 'Describe what you need', icon: Plus },
                                        { step: 2, title: 'Community responds', desc: 'Neighbours reach out', icon: Users },
                                        { step: 3, title: 'Get help', desc: 'Connect and resolve', icon: Shield },
                                    ].map(({ step, title, desc, icon: StepIcon }) => (
                                        <div key={step} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                                <StepIcon className="w-5 h-5 text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">{title}</p>
                                                <p className="text-sm text-stone-500">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white border border-stone-200 rounded-2xl p-5">
                                <h3 className="font-bold text-stone-900 mb-4">Quick Links</h3>
                                <div className="space-y-1">
                                    {[
                                        { href: '/create', label: 'Post a request' },
                                        { href: '/map', label: 'Map view' },
                                        { href: '/', label: 'Home' },
                                    ].map(({ href, label }) => (
                                        <Link key={href} href={href} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-stone-600 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                                            <span>{label}</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-5 text-white">
                                <Zap className="w-8 h-8 mb-3 opacity-80" />
                                <h3 className="font-bold mb-2">Want to help?</h3>
                                <p className="text-sm text-teal-100 mb-4">Make a difference in someone&apos;s life today.</p>
                                <button
                                    onClick={() => handleFilterChange({ ...filters, category: '' })}
                                    className="w-full py-2.5 px-4 bg-white text-teal-700 text-sm font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                                >
                                    Browse All Requests
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default function RequestsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-stone-50"><div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin"></div></div>}>
            <RequestsContent />
        </Suspense>
    );
}
