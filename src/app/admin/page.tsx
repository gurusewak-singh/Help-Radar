'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Trash2, Eye, AlertTriangle, CheckCircle, RefreshCw, MapPin, Loader2, TrendingUp, Clock, Search, Heart, HelpCircle, Gift, ShieldX, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Dynamic import for charts (client-side only)
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

interface Post {
    _id: string;
    title: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    urgency: 'Low' | 'Medium' | 'High';
    status: string;
    views: number;
    reported: number;
    createdAt: string;
}

interface Stats {
    overview: {
        totalActive: number;
        totalResolved: number;
        totalViews: number;
        recentPosts: number;
        highUrgencyCount: number;
    };
    topCities: Array<{ city: string; count: number }>;
    categoryCounts: Record<string, number>;
    weeklyData?: Array<{ day: string; posts: number; views: number }>;
}

const MOCK_POSTS: Post[] = [
    { _id: '1', title: 'A+ Blood Donor Urgently Required - City Hospital', category: 'Blood Needed', city: 'Delhi', urgency: 'High', status: 'active', views: 156, reported: 0, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { _id: '2', title: 'Lost Black Wallet Near MG Road Metro Station', category: 'Item Lost', city: 'Bangalore', urgency: 'Medium', status: 'active', views: 89, reported: 2, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { _id: '3', title: 'Senior Citizen Needs Grocery Pickup Help', category: 'Help Needed', city: 'Mumbai', urgency: 'Medium', status: 'active', views: 234, reported: 0, createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    { _id: '4', title: 'Spam Post Example - Should Be Removed', category: 'Offer', city: 'Chennai', urgency: 'Low', status: 'active', views: 12, reported: 5, createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
    { _id: '5', title: 'O- Blood Required Emergency at Apollo Hospital', category: 'Blood Needed', city: 'Hyderabad', urgency: 'High', status: 'resolved', views: 445, reported: 0, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { _id: '6', title: 'Free Math Tutoring for School Students', category: 'Offer', city: 'Pune', urgency: 'Low', status: 'active', views: 78, reported: 0, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
];

const MOCK_STATS: Stats = {
    overview: { totalActive: 156, totalResolved: 89, totalViews: 12450, recentPosts: 23, highUrgencyCount: 12 },
    topCities: [{ city: 'Delhi', count: 45 }, { city: 'Mumbai', count: 38 }, { city: 'Bangalore', count: 32 }, { city: 'Chennai', count: 21 }, { city: 'Hyderabad', count: 20 }],
    categoryCounts: { 'Help Needed': 45, 'Item Lost': 38, 'Blood Needed': 28, 'Offer': 45 },
    weeklyData: [
        { day: 'Mon', posts: 12, views: 1200 },
        { day: 'Tue', posts: 19, views: 1800 },
        { day: 'Wed', posts: 15, views: 1400 },
        { day: 'Thu', posts: 22, views: 2100 },
        { day: 'Fri', posts: 18, views: 1650 },
        { day: 'Sat', posts: 25, views: 2400 },
        { day: 'Sun', posts: 20, views: 1900 }
    ]
};

const CATEGORY_COLORS: Record<string, string> = {
    'Help Needed': '#3b82f6',
    'Item Lost': '#f59e0b',
    'Blood Needed': '#ef4444',
    'Offer': '#10b981'
};

const categoryLabels: Record<string, string> = {
    'Help Needed': 'Help',
    'Item Lost': 'Lost',
    'Blood Needed': 'Blood',
    'Offer': 'Offer'
};

function formatTimeAgo(dateString: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default function AdminPage() {
    const { isLoggedIn, isAdmin, isLoading: authLoading, user } = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'reported' | 'urgent'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, statsRes] = await Promise.all([
                    fetch('/api/posts?limit=50'),
                    fetch('/api/stats')
                ]);
                setPosts(postsRes.ok ? (await postsRes.json()).posts : MOCK_POSTS);
                const statsData = statsRes.ok ? await statsRes.json() : MOCK_STATS;
                // Add weekly data if not present
                if (!statsData.weeklyData) statsData.weeklyData = MOCK_STATS.weeklyData;
                setStats(statsData);
            } catch {
                setPosts(MOCK_POSTS);
                setStats(MOCK_STATS);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) setPosts(posts.filter(p => p._id !== id));
        } catch (e) { console.error(e); }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) setPosts(posts.map(p => p._id === id ? { ...p, status } : p));
        } catch (e) { console.error(e); }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesFilter = filter === 'all' ||
                (filter === 'reported' && post.reported > 0) ||
                (filter === 'urgent' && post.urgency === 'High');
            const matchesSearch = !debouncedSearch ||
                post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                post.city.toLowerCase().includes(debouncedSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [posts, filter, debouncedSearch]);

    // Prepare chart data from stats
    const categoryData = useMemo(() => {
        if (!stats?.categoryCounts) return [];
        return Object.entries(stats.categoryCounts).map(([name, value]) => ({
            name: categoryLabels[name] || name,
            value,
            color: CATEGORY_COLORS[name] || '#94a3b8'
        }));
    }, [stats]);

    const cityData = useMemo(() => {
        return stats?.topCities?.slice(0, 5) || [];
    }, [stats]);

    // Auth loading state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
        );
    }

    // Not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-stone-400" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 mb-2">Login Required</h1>
                    <p className="text-stone-500 mb-6">Please log in to access the admin dashboard.</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    // Not an admin
    if (!isAdmin) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldX className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 mb-2">Access Denied</h1>
                    <p className="text-stone-500 mb-2">You don&apos;t have permission to access the admin dashboard.</p>
                    <p className="text-sm text-stone-400 mb-6">
                        Logged in as: <span className="font-medium text-stone-600">{user?.email}</span>
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    // Data loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 text-stone-400 hover:text-stone-600 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-semibold text-stone-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 pl-9 pr-3 py-1.5 bg-stone-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            />
                        </div>
                        <button onClick={() => window.location.reload()} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-stone-200">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-stone-500">Active</p>
                            <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">+{stats?.overview.recentPosts}</span>
                        </div>
                        <p className="text-2xl font-bold text-stone-900 mt-1">{stats?.overview.totalActive}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-stone-200">
                        <p className="text-sm text-stone-500">Resolved</p>
                        <p className="text-2xl font-bold text-stone-900 mt-1">{stats?.overview.totalResolved}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-stone-200">
                        <p className="text-sm text-stone-500">Total Views</p>
                        <p className="text-2xl font-bold text-stone-900 mt-1">{((stats?.overview.totalViews || 0) / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-red-100 bg-red-50/50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-red-600">Urgent</p>
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats?.overview.highUrgencyCount}</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Activity Chart */}
                    <div className="col-span-2 bg-white rounded-xl p-5 border border-stone-200">
                        <h3 className="text-sm font-semibold text-stone-900 mb-4">Weekly Activity</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.weeklyData || []}>
                                    <defs>
                                        <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} width={30} />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="posts" stroke="#14b8a6" strokeWidth={2} fill="url(#colorPosts)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl p-5 border border-stone-200">
                        <h3 className="text-sm font-semibold text-stone-900 mb-4">Categories</h3>
                        <div className="h-32 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={50}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {categoryData.map(cat => (
                                <span key={cat.name} className="flex items-center gap-1.5 text-xs text-stone-600">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Cities Bar Chart */}
                <div className="bg-white rounded-xl p-5 border border-stone-200 mb-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Posts by City</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical">
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                                <YAxis type="category" dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1c1917' }} width={80} />
                                <Tooltip
                                    contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    {/* Header with Tabs */}
                    <div className="flex items-center justify-between p-4 border-b border-stone-100">
                        <h2 className="text-base font-semibold text-stone-900">Recent Posts</h2>
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'urgent', label: 'Urgent' },
                                { key: 'reported', label: 'Flagged' }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key as typeof filter)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === tab.key
                                        ? 'bg-white text-stone-900 shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Posts List */}
                    {filteredPosts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="w-5 h-5 text-stone-400" />
                            </div>
                            <p className="text-stone-500">No posts found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {filteredPosts.map(post => (
                                <div
                                    key={post._id}
                                    className={`group p-4 hover:bg-stone-50/50 transition-colors ${post.reported > 0 ? 'bg-orange-50/30' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Category Avatar */}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${post.category === 'Blood Needed' ? 'bg-red-100' :
                                            post.category === 'Help Needed' ? 'bg-blue-100' :
                                                post.category === 'Item Lost' ? 'bg-amber-100' : 'bg-emerald-100'
                                            }`}>
                                            {post.category === 'Blood Needed' && <Heart className="w-5 h-5 text-red-600" />}
                                            {post.category === 'Help Needed' && <HelpCircle className="w-5 h-5 text-blue-600" />}
                                            {post.category === 'Item Lost' && <Search className="w-5 h-5 text-amber-600" />}
                                            {post.category === 'Offer' && <Gift className="w-5 h-5 text-emerald-600" />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title row */}
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <Link
                                                    href={`/post/${post._id}`}
                                                    className="font-medium text-stone-900 hover:text-teal-700 transition-colors line-clamp-1"
                                                >
                                                    {post.title}
                                                </Link>

                                                {/* Actions - visible on hover */}
                                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {post.status === 'active' ? (
                                                        <button
                                                            onClick={() => handleStatusChange(post._id, 'resolved')}
                                                            className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Mark as resolved"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStatusChange(post._id, 'active')}
                                                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Reactivate"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Badges row */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${CATEGORY_COLORS[post.category]}12`,
                                                        color: CATEGORY_COLORS[post.category]
                                                    }}
                                                >
                                                    {categoryLabels[post.category]}
                                                </span>
                                                {post.urgency === 'High' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                        Urgent
                                                    </span>
                                                )}
                                                {post.reported > 0 && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {post.reported} reports
                                                    </span>
                                                )}
                                                {post.status === 'resolved' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Resolved
                                                    </span>
                                                )}
                                            </div>

                                            {/* Meta row */}
                                            <div className="flex items-center gap-4 text-xs text-stone-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {post.city}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {post.views} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatTimeAgo(post.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
