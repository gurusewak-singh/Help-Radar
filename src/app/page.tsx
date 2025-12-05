'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import FiltersBar, { Filters } from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import { Heart, HelpCircle, Search, Gift, Plus, MapPin, TrendingUp, Clock, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

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
  { key: 'Blood Needed', label: 'Blood Needed', icon: Heart, color: 'red', desc: 'Urgent blood donation requests' },
  { key: 'Help Needed', label: 'Help Needed', icon: HelpCircle, color: 'blue', desc: 'Community assistance requests' },
  { key: 'Item Lost', label: 'Lost & Found', icon: Search, color: 'amber', desc: 'Lost items and found belongings' },
  { key: 'Offer', label: 'Offers', icon: Gift, color: 'emerald', desc: 'Help and resources offered' },
];

function HomeContent() {
  const searchParams = useSearchParams();
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
        setPosts(filteredPosts);
        setTotalPages(1);
      }
    } catch { setPosts(MOCK_POSTS); setTotalPages(1); }
    finally { setLoading(false); }
  }, [filters, currentPage]);

  const fetchStats = useCallback(async () => {
    try { const res = await fetch('/api/stats'); setStats(res.ok ? await res.json() : MOCK_STATS); }
    catch { setStats(MOCK_STATS); }
  }, []);

  useEffect(() => { fetchPosts(); fetchStats(); }, [fetchPosts, fetchStats]);
  const handleFilterChange = (newFilters: Filters) => { setFilters(newFilters); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-3">
              Community Help Network
            </h1>
            <p className="text-lg text-stone-600 mb-6">
              Connect with neighbours, find help when you need it, and support others in your community.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Post a Request
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-stone-700 font-medium border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                View Map
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-stone-100">
              <div>
                <p className="text-2xl font-bold text-stone-900">{stats.overview.totalActive}</p>
                <p className="text-sm text-stone-500">Active requests</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div>
                <p className="text-2xl font-bold text-teal-600">+{stats.overview.recentPosts}</p>
                <p className="text-sm text-stone-500">New today</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overview.highUrgencyCount}</p>
                <p className="text-sm text-stone-500">Need urgent help</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {CATEGORIES.map(({ key, label, icon: Icon, color, desc }) => (
            <button
              key={key}
              onClick={() => handleFilterChange({ ...filters, category: filters.category === key ? '' : key })}
              className={`group p-4 rounded-xl text-left transition-all ${filters.category === key
                ? `bg-${color}-50 border-2 border-${color}-200`
                : 'bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${filters.category === key
                ? `bg-${color}-100`
                : 'bg-stone-100 group-hover:bg-stone-200'
                }`}>
                <Icon className={`w-5 h-5 ${color === 'red' ? 'text-red-600' :
                  color === 'blue' ? 'text-blue-600' :
                    color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
              </div>
              <p className="font-medium text-stone-900 mb-0.5">{label}</p>
              <p className="text-xs text-stone-500">{stats?.categoryCounts[key] || 0} active</p>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:flex lg:gap-8">
          {/* Posts Section */}
          <main className="flex-1 min-w-0">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">
                  {filters.category || 'All Requests'}
                </h2>
                <p className="text-sm text-stone-500">
                  {loading ? 'Loading...' : `${posts.length} results`}
                </p>
              </div>
            </div>

            {/* Filters */}
            <FiltersBar onFilterChange={handleFilterChange} initialFilters={filters} />

            {/* Posts List */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-stone-200">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-600 font-medium mb-1">No requests found</p>
                <p className="text-sm text-stone-400 mb-4">Try adjusting your filters or search terms</p>
                <Link href="/create" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                  Post the first request
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Urgent Banner */}
              {stats && stats.overview.highUrgencyCount > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-semibold text-red-700">Urgent Requests</span>
                  </div>
                  <p className="text-sm text-red-600 mb-3">
                    {stats.overview.highUrgencyCount} people need immediate help
                  </p>
                  <button
                    onClick={() => handleFilterChange({ ...filters, urgency: 'High' })}
                    className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
                  >
                    View urgent requests
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* How It Works */}
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <h3 className="font-semibold text-stone-900 mb-3">How it works</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-700">1</div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">Post your request</p>
                      <p className="text-xs text-stone-500">Describe what you need help with</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-700">2</div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">Community responds</p>
                      <p className="text-xs text-stone-500">Neighbours see and reach out</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-700">3</div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">Get help</p>
                      <p className="text-xs text-stone-500">Connect and resolve together</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <h3 className="font-semibold text-stone-900 mb-3">Quick Links</h3>
                <div className="space-y-1">
                  <Link href="/create" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                    <span>Post a request</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link href="/map" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                    <span>Map view</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link href="/admin" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                    <span>Admin dashboard</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-stone-200 border-t-teal-600 rounded-full animate-spin"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}
