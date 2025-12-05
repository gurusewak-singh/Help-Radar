'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Eye, AlertTriangle, CheckCircle, XCircle, RefreshCw, Users, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import CategoryBadge from '@/components/CategoryBadge';
import UrgencyIndicator from '@/components/UrgencyIndicator';

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
    hotspots: Array<{ city: string; area: string; count: number }>;
}

// Mock data
const MOCK_POSTS: Post[] = [
    {
        _id: '1',
        title: 'A+ Blood Donor Urgently Required - City Hospital',
        category: 'Blood Needed',
        city: 'Delhi',
        urgency: 'High',
        status: 'active',
        views: 156,
        reported: 0,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '2',
        title: 'Lost Black Wallet Near MG Road',
        category: 'Item Lost',
        city: 'Bangalore',
        urgency: 'Medium',
        status: 'active',
        views: 89,
        reported: 2,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '3',
        title: 'Senior Citizen Needs Grocery',
        category: 'Help Needed',
        city: 'Mumbai',
        urgency: 'Medium',
        status: 'active',
        views: 234,
        reported: 0,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '4',
        title: 'Spam Post - Delete This',
        category: 'Offer',
        city: 'Chennai',
        urgency: 'Low',
        status: 'active',
        views: 12,
        reported: 5,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    }
];

const MOCK_STATS: Stats = {
    overview: {
        totalActive: 156,
        totalResolved: 89,
        totalViews: 12450,
        recentPosts: 23,
        highUrgencyCount: 12
    },
    topCities: [
        { city: 'Delhi', count: 45 },
        { city: 'Mumbai', count: 38 },
        { city: 'Bangalore', count: 32 },
        { city: 'Chennai', count: 21 },
        { city: 'Hyderabad', count: 20 }
    ],
    hotspots: [
        { city: 'Delhi', area: 'Connaught Place', count: 12 },
        { city: 'Mumbai', area: 'Andheri', count: 10 },
        { city: 'Bangalore', area: 'Koramangala', count: 8 }
    ]
};

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'reported' | 'resolved'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to fetch from API
                const [postsRes, statsRes] = await Promise.all([
                    fetch('/api/posts?limit=50'),
                    fetch('/api/stats')
                ]);

                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    setPosts(postsData.posts);
                } else {
                    setPosts(MOCK_POSTS);
                }

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                } else {
                    setStats(MOCK_STATS);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setPosts(MOCK_POSTS);
                setStats(MOCK_STATS);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setPosts(posts.map(p => p._id === id ? { ...p, status } : p));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'reported') return post.reported > 0;
        if (filter === 'resolved') return post.status === 'resolved';
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Feed
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400">Manage posts and monitor community activity</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Active Posts"
                        value={stats.overview.totalActive}
                        icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
                        color="purple"
                    />
                    <StatsCard
                        title="Resolved"
                        value={stats.overview.totalResolved}
                        icon={<CheckCircle className="w-6 h-6 text-green-400" />}
                        color="green"
                    />
                    <StatsCard
                        title="Total Views"
                        value={stats.overview.totalViews.toLocaleString()}
                        icon={<Eye className="w-6 h-6 text-blue-400" />}
                        color="blue"
                    />
                    <StatsCard
                        title="High Urgency"
                        value={stats.overview.highUrgencyCount}
                        icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
                        color="red"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Posts Management */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        {/* Filter Tabs */}
                        <div className="flex border-b border-white/10">
                            {[
                                { key: 'all', label: 'All Posts', count: posts.length },
                                { key: 'reported', label: 'Reported', count: posts.filter(p => p.reported > 0).length },
                                { key: 'resolved', label: 'Resolved', count: posts.filter(p => p.status === 'resolved').length }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key as typeof filter)}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${filter === tab.key
                                            ? 'text-purple-400 border-b-2 border-purple-400'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Posts List */}
                        <div className="divide-y divide-white/10">
                            {filteredPosts.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    No posts found
                                </div>
                            ) : (
                                filteredPosts.map(post => (
                                    <div key={post._id} className="p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <CategoryBadge category={post.category} size="sm" />
                                                    <UrgencyIndicator urgency={post.urgency} size="sm" />
                                                    {post.reported > 0 && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {post.reported} reports
                                                        </span>
                                                    )}
                                                    {post.status === 'resolved' && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Resolved
                                                        </span>
                                                    )}
                                                </div>
                                                <Link href={`/post/${post._id}`} className="block">
                                                    <h4 className="text-white font-medium truncate hover:text-purple-300 transition-colors">
                                                        {post.title}
                                                    </h4>
                                                </Link>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {post.city}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {post.views}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {post.status === 'active' && (
                                                    <button
                                                        onClick={() => handleStatusChange(post._id, 'resolved')}
                                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                                        title="Mark as resolved"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {post.status === 'resolved' && (
                                                    <button
                                                        onClick={() => handleStatusChange(post._id, 'active')}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                        title="Reactivate"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Top Cities */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            Top Cities
                        </h3>
                        <div className="space-y-3">
                            {stats?.topCities.map((city, idx) => (
                                <div key={city.city} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 flex items-center justify-center bg-purple-500/20 rounded-full text-xs text-purple-400">
                                            {idx + 1}
                                        </span>
                                        <span className="text-white">{city.city}</span>
                                    </div>
                                    <span className="text-slate-400">{city.count} posts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hotspots */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber-400" />
                            Activity Hotspots
                        </h3>
                        <div className="space-y-3">
                            {stats?.hotspots.map((spot, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white">{spot.area}</p>
                                        <p className="text-xs text-slate-400">{spot.city}</p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                                        {spot.count} posts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full py-2 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm text-left">
                                Clear all reported posts
                            </button>
                            <button className="w-full py-2 px-4 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm text-left">
                                Archive expired posts
                            </button>
                            <button className="w-full py-2 px-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm text-left">
                                Export data (CSV)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
