'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import FiltersBar, { Filters } from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';
import StatsCard from '@/components/StatsCard';
import { Heart, HelpCircle, Search, Gift, TrendingUp, Eye, Clock, AlertTriangle, Plus, Loader2 } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
  city: string;
  area?: string;
  urgency: 'Low' | 'Medium' | 'High';
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  images?: Array<{ url: string }>;
  views: number;
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
  categoryCounts: Record<string, number>;
}

// Mock data for demo
const MOCK_POSTS: Post[] = [
  {
    _id: '1',
    title: 'A+ Blood Donor Urgently Required - City Hospital',
    description: 'My father needs A+ blood urgently for surgery at City Hospital, Sector 21. Please help if you can donate. Contact immediately.',
    category: 'Blood Needed',
    city: 'Delhi',
    area: 'Sector 21',
    urgency: 'High',
    contact: { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@email.com' },
    views: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '2',
    title: 'Lost Black Wallet Near MG Road Metro Station',
    description: 'Lost my black leather wallet containing ID cards and some cash near MG Road Metro Station entrance. Reward offered for return.',
    category: 'Item Lost',
    city: 'Bangalore',
    area: 'MG Road',
    urgency: 'Medium',
    contact: { name: 'Priya Patel', phone: '9123456789' },
    views: 89,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '3',
    title: 'Senior Citizen Needs Grocery Pickup Assistance',
    description: 'Elderly person living alone needs help with weekly grocery shopping. Cannot travel due to mobility issues. Any volunteer welcome.',
    category: 'Help Needed',
    city: 'Mumbai',
    area: 'Andheri West',
    urgency: 'Medium',
    contact: { name: 'Meera Aunty', phone: '9988776655' },
    views: 234,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '4',
    title: 'Free Tutoring for Underprivileged Children',
    description: 'Offering free Math and Science tutoring for children from underprivileged backgrounds. Available on weekends. Experience in teaching for 5 years.',
    category: 'Offer',
    city: 'Chennai',
    area: 'T. Nagar',
    urgency: 'Low',
    contact: { name: 'Arun Kumar', email: 'arun.tutor@email.com' },
    views: 312,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '5',
    title: 'O- Blood Needed for Emergency Surgery',
    description: 'Urgent requirement of O negative blood at Apollo Hospital. Patient is in critical condition. Any donors please contact immediately.',
    category: 'Blood Needed',
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    urgency: 'High',
    contact: { name: 'Dr. Reddy', phone: '9876123450' },
    views: 445,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '6',
    title: 'Lost iPhone 14 Pro - Grey Color',
    description: 'Lost my iPhone 14 Pro (Space Grey) in an Uber cab yesterday evening around Koramangala area. Has a distinctive crack on the corner.',
    category: 'Item Lost',
    city: 'Bangalore',
    area: 'Koramangala',
    urgency: 'High',
    contact: { name: 'Vikram Singh', phone: '9012345678' },
    views: 178,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '7',
    title: 'Need Volunteers for Flood Relief Work',
    description: 'Looking for volunteers to help with flood relief distribution in affected areas. Transportation and food will be provided. Join us this weekend.',
    category: 'Help Needed',
    city: 'Kolkata',
    area: 'Salt Lake',
    urgency: 'High',
    contact: { name: 'NGO Seva', phone: '9111222333', email: 'seva.ngo@email.com' },
    views: 567,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '8',
    title: 'Donating Winter Clothes for Homeless',
    description: 'Have collected warm clothes, blankets, and jackets for homeless people. Looking for coordinators to help distribute in different areas.',
    category: 'Offer',
    city: 'Delhi',
    area: 'Connaught Place',
    urgency: 'Low',
    contact: { name: 'Helping Hands', email: 'info@helpinghands.org' },
    views: 289,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '9',
    title: 'B+ Blood Donor Needed at AIIMS',
    description: 'Patient admitted for liver transplant requires B+ blood. 3 units needed. Please help save a life. AIIMS, New Delhi.',
    category: 'Blood Needed',
    city: 'Delhi',
    area: 'AIIMS',
    urgency: 'High',
    contact: { name: 'Amit Verma', phone: '9898989898' },
    views: 334,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '10',
    title: 'Lost Pet Dog - Golden Retriever Named Bruno',
    description: 'Our beloved Golden Retriever Bruno went missing from Banjara Hills. He is friendly and has a blue collar with our contact info.',
    category: 'Item Lost',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    urgency: 'High',
    contact: { name: 'Sanjay Rao', phone: '9876512340' },
    views: 423,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '11',
    title: 'Need Help Moving Furniture - Will Pay',
    description: 'Moving to a new apartment and need 2-3 people to help move furniture. Will pay Rs 500 per person. Work will take around 3 hours.',
    category: 'Help Needed',
    city: 'Pune',
    area: 'Koregaon Park',
    urgency: 'Medium',
    contact: { name: 'Rohan Joshi', phone: '9777888999' },
    views: 145,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '12',
    title: 'Free Medical Camp This Sunday',
    description: 'Organizing a free health checkup camp including blood pressure, diabetes, and eye checkup. All are welcome. Doctors will be available.',
    category: 'Offer',
    city: 'Mumbai',
    area: 'Dharavi',
    urgency: 'Low',
    contact: { name: 'Health First NGO', email: 'contact@healthfirst.org' },
    views: 678,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
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
  categoryCounts: {
    'Help Needed': 45,
    'Item Lost': 38,
    'Blood Needed': 28,
    'Offer': 45
  }
};

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
      // Try to fetch from API first
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.category) params.set('category', filters.category);
      if (filters.urgency) params.set('urgency', filters.urgency);
      if (filters.q) params.set('q', filters.q);
      params.set('sort', filters.sort);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const res = await fetch(`/api/posts?${params.toString()}`);

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      } else {
        // Fallback to mock data
        let filteredPosts = [...MOCK_POSTS];

        if (filters.city) {
          filteredPosts = filteredPosts.filter(p =>
            p.city.toLowerCase().includes(filters.city.toLowerCase())
          );
        }
        if (filters.category) {
          filteredPosts = filteredPosts.filter(p => p.category === filters.category);
        }
        if (filters.urgency) {
          filteredPosts = filteredPosts.filter(p => p.urgency === filters.urgency);
        }
        if (filters.q) {
          const query = filters.q.toLowerCase();
          filteredPosts = filteredPosts.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
          );
        }

        if (filters.sort === 'priority') {
          filteredPosts.sort((a, b) => {
            const urgencyOrder = { High: 3, Medium: 2, Low: 1 };
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
          });
        }

        setPosts(filteredPosts);
        setTotalPages(Math.ceil(filteredPosts.length / 12));
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // Use mock data on error
      setPosts(MOCK_POSTS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setStats(MOCK_STATS);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(MOCK_STATS);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [fetchPosts, fetchStats]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Hyperlocal Community Help
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Connect with your community. Post help requests, find lost items, donate blood, and offer assistance to those in need.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Post a Request
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-white/10 text-white font-semibold rounded-xl hover:bg-slate-700/50 transition-all"
          >
            <Search className="w-5 h-5" />
            Explore Map
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Active Requests"
            value={stats.overview.totalActive}
            icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
            color="purple"
          />
          <StatsCard
            title="Total Views"
            value={stats.overview.totalViews.toLocaleString()}
            icon={<Eye className="w-6 h-6 text-blue-400" />}
            color="blue"
          />
          <StatsCard
            title="Today's Posts"
            value={stats.overview.recentPosts}
            icon={<Clock className="w-6 h-6 text-green-400" />}
            color="green"
          />
          <StatsCard
            title="Urgent Requests"
            value={stats.overview.highUrgencyCount}
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            color="red"
          />
        </section>
      )}

      {/* Category Quick Filters */}
      <section className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { category: '', label: 'All', icon: null, count: stats?.overview.totalActive },
          { category: 'Blood Needed', label: 'Blood Needed', icon: Heart, count: stats?.categoryCounts['Blood Needed'] },
          { category: 'Help Needed', label: 'Help Needed', icon: HelpCircle, count: stats?.categoryCounts['Help Needed'] },
          { category: 'Item Lost', label: 'Lost & Found', icon: Search, count: stats?.categoryCounts['Item Lost'] },
          { category: 'Offer', label: 'Offers', icon: Gift, count: stats?.categoryCounts['Offer'] },
        ].map(({ category, label, icon: Icon, count }) => (
          <button
            key={category}
            onClick={() => handleFilterChange({ ...filters, category })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${filters.category === category
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50'
              }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
            {count !== undefined && (
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{count}</span>
            )}
          </button>
        ))}
      </section>

      {/* Filters */}
      <FiltersBar
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Posts Grid */}
      <section>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search query</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create the first post
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
