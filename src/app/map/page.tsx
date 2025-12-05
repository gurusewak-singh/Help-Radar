'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Filter, Loader2, List, MapPin } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';

// Dynamic import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-slate-800/50 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
    )
});

interface Post {
    _id: string;
    title: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    area?: string;
    urgency: 'Low' | 'Medium' | 'High';
    location?: {
        coordinates: [number, number];
    };
}

// Mock data with coordinates
const MOCK_POSTS: Post[] = [
    {
        _id: '1',
        title: 'A+ Blood Donor Urgently Required',
        category: 'Blood Needed',
        city: 'Delhi',
        area: 'Sector 21',
        urgency: 'High',
        location: { coordinates: [77.2090, 28.6139] }
    },
    {
        _id: '2',
        title: 'Lost Black Wallet',
        category: 'Item Lost',
        city: 'Bangalore',
        area: 'MG Road',
        urgency: 'Medium',
        location: { coordinates: [77.6197, 12.9716] }
    },
    {
        _id: '3',
        title: 'Senior Citizen Needs Grocery',
        category: 'Help Needed',
        city: 'Mumbai',
        area: 'Andheri West',
        urgency: 'Medium',
        location: { coordinates: [72.8777, 19.0760] }
    },
    {
        _id: '4',
        title: 'Free Tutoring Available',
        category: 'Offer',
        city: 'Chennai',
        area: 'T. Nagar',
        urgency: 'Low',
        location: { coordinates: [80.2707, 13.0827] }
    },
    {
        _id: '5',
        title: 'O- Blood Needed Emergency',
        category: 'Blood Needed',
        city: 'Hyderabad',
        area: 'Jubilee Hills',
        urgency: 'High',
        location: { coordinates: [78.4867, 17.3850] }
    },
    {
        _id: '6',
        title: 'Volunteers for Flood Relief',
        category: 'Help Needed',
        city: 'Kolkata',
        area: 'Salt Lake',
        urgency: 'High',
        location: { coordinates: [88.3639, 22.5726] }
    },
    {
        _id: '7',
        title: 'Lost Pet Dog Bruno',
        category: 'Item Lost',
        city: 'Pune',
        area: 'Koregaon Park',
        urgency: 'High',
        location: { coordinates: [73.8567, 18.5204] }
    },
    {
        _id: '8',
        title: 'Free Medical Camp',
        category: 'Offer',
        city: 'Jaipur',
        area: 'Pink City',
        urgency: 'Low',
        location: { coordinates: [75.7873, 26.9124] }
    }
];

export default function MapPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?limit=100');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts);
                } else {
                    setPosts(MOCK_POSTS);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                setPosts(MOCK_POSTS);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = selectedCategory
        ? posts.filter(p => p.category === selectedCategory)
        : posts;

    const postsWithLocation = filteredPosts.filter(p => p.location);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Feed
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Map View</h1>
                    <p className="text-slate-400">Explore help requests near you</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowList(!showList)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${showList
                                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                                : 'bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        Show List
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { value: '', label: 'All Categories' },
                    { value: 'Blood Needed', label: 'Blood Needed' },
                    { value: 'Help Needed', label: 'Help Needed' },
                    { value: 'Item Lost', label: 'Lost Items' },
                    { value: 'Offer', label: 'Offers' },
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setSelectedCategory(value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === value
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{postsWithLocation.length} posts with location</span>
                </div>
                <div className="text-sm text-slate-400">
                    {filteredPosts.length} total matching posts
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className={showList ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    {loading ? (
                        <div className="w-full h-[500px] bg-slate-800/50 rounded-2xl flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    ) : (
                        <MapView posts={postsWithLocation} />
                    )}
                </div>

                {/* Side List */}
                {showList && (
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h3 className="font-semibold text-white">Nearby Posts</h3>
                        </div>
                        <div className="max-h-[440px] overflow-y-auto">
                            {postsWithLocation.length === 0 ? (
                                <p className="p-4 text-slate-400 text-center">No posts with location data</p>
                            ) : (
                                postsWithLocation.map(post => (
                                    <Link
                                        key={post._id}
                                        href={`/post/${post._id}`}
                                        className="block p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="mb-2">
                                                    <CategoryBadge category={post.category} size="sm" />
                                                </div>
                                                <h4 className="text-sm font-medium text-white truncate">{post.title}</h4>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {post.city}{post.area ? `, ${post.area}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <h4 className="text-sm font-medium text-white mb-3">Map Legend</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-slate-300">Blood Needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-300">Help Needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-slate-300">Item Lost</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-slate-300">Offer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
