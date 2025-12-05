'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Eye, Phone, User, Flag, Share2, CheckCircle, Loader2, Heart, HelpCircle, Search, Gift } from 'lucide-react';
import ContactModal from '@/components/ContactModal';

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
    expiresAt?: string;
    status: string;
}

const MOCK_POST: Post = {
    _id: '1',
    title: 'A+ Blood Donor Urgently Required - City Hospital',
    description: `My father is admitted at City Hospital, Sector 21 and requires A+ blood urgently for surgery.

The surgery is scheduled for tomorrow morning and we need at least 2 units of A+ blood. The blood bank is running low and we are reaching out to the community for help.

Details:
• Blood Type: A Positive (A+)
• Hospital: City Hospital, Sector 21
• Required: 2 Units minimum
• When: Before 6 AM tomorrow

Please contact immediately if you can help. The hospital blood bank is open 24/7. Thank you for your help.`,
    category: 'Blood Needed',
    city: 'Delhi',
    area: 'Sector 21',
    urgency: 'High',
    contact: { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul.sharma@email.com' },
    images: [{ url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800' }],
    views: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
};

const catConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    'Blood Needed': { icon: Heart, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    'Help Needed': { icon: HelpCircle, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    'Item Lost': { icon: Search, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    'Offer': { icon: Gift, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const formatTimeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
    return `${Math.floor(s / 86400)} days ago`;
};

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [showContact, setShowContact] = useState(false);
    const [copied, setCopied] = useState(false);
    const [reported, setReported] = useState(false);

    useEffect(() => {
        fetch(`/api/posts/${id}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => setPost(d?.post || MOCK_POST))
            .catch(() => setPost(MOCK_POST))
            .finally(() => setLoading(false));
    }, [id]);

    const share = async () => {
        try {
            if (navigator.share) await navigator.share({ title: post?.title, url: location.href });
            else { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        } catch { }
    };

    const report = () => { setReported(true); };

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>;
    if (!post) return <div className="text-center py-32"><p className="text-stone-500">Post not found</p><Link href="/" className="text-teal-600 mt-2 block">← Back</Link></div>;

    const { icon: CatIcon, color, bg, border } = catConfig[post.category];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-100">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/requests" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to requests
                    </Link>
                    <div className="flex gap-1">
                        <button onClick={share} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                            {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                        </button>
                        <button onClick={report} disabled={reported} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 disabled:text-green-600">
                            {reported ? <CheckCircle className="w-5 h-5" /> : <Flag className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-10">
                    {/* Left: Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Urgent */}
                        {post.urgency === 'High' && (
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-red-500" /></span>
                                <span className="text-sm font-medium text-red-700">Urgent</span>
                            </div>
                        )}

                        {/* Category Badge */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${bg} ${color} border ${border}`}>
                                <CatIcon className="w-4 h-4" /> {post.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-stone-900 leading-tight mb-4">{post.title}</h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500 mb-6 pb-6 border-b border-stone-100">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal-600" />{post.city}{post.area && `, ${post.area}`}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatTimeAgo(post.createdAt)}</span>
                            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{post.views} views</span>
                        </div>

                        {/* Image */}
                        {post.images?.[0] && (
                            <div className="mb-6 rounded-xl overflow-hidden border border-stone-100">
                                <img src={post.images[0].url} alt="" className="w-full aspect-[16/9] object-cover" />
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-stone max-w-none mb-8">
                            <div className="text-stone-700 leading-7 whitespace-pre-line">{post.description}</div>
                        </div>

                        {/* Details */}
                        <div className="flex gap-6 text-sm pb-6 border-b border-stone-100">
                            <div><span className="text-stone-400 block mb-0.5">Posted on</span><span className="text-stone-900 font-medium">{formatDate(post.createdAt)}</span></div>
                            {post.expiresAt && <div><span className="text-stone-400 block mb-0.5">Expires</span><span className="text-stone-900 font-medium">{formatDate(post.expiresAt)}</span></div>}
                            <div><span className="text-stone-400 block mb-0.5">Status</span><span className={`font-medium ${post.status === 'active' ? 'text-green-600' : 'text-stone-600'}`}>{post.status === 'active' ? 'Active' : post.status}</span></div>
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <aside className="w-80 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-20">
                            {/* Contact Card */}
                            {post.contact && (
                                <div className="bg-stone-50 rounded-2xl p-6 mb-4">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400">Posted by</p>
                                            <p className="font-semibold text-stone-900">{post.contact.name || 'Anonymous'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowContact(true)}
                                        className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                                        <Phone className="w-5 h-5" /> View Contact
                                    </button>
                                </div>
                            )}

                            {/* Quick Info */}
                            <div className="bg-stone-50 rounded-2xl p-5">
                                <h3 className="text-sm font-semibold text-stone-900 mb-3">Quick Info</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between"><dt className="text-stone-400">Category</dt><dd className="text-stone-900 font-medium">{post.category}</dd></div>
                                    <div className="flex justify-between"><dt className="text-stone-400">Location</dt><dd className="text-stone-900 font-medium">{post.city}</dd></div>
                                    <div className="flex justify-between"><dt className="text-stone-400">Urgency</dt><dd className={`font-medium ${post.urgency === 'High' ? 'text-red-600' : post.urgency === 'Medium' ? 'text-amber-600' : 'text-stone-600'}`}>{post.urgency}</dd></div>
                                    <div className="flex justify-between"><dt className="text-stone-400">Views</dt><dd className="text-stone-900 font-medium">{post.views}</dd></div>
                                </dl>
                            </div>

                            {/* Safety */}
                            <p className="text-xs text-stone-400 mt-4 text-center">Verify details before helping • <button onClick={report} className="text-teal-600 hover:underline">Report</button></p>
                        </div>
                    </aside>
                </div>

                {/* Mobile Contact */}
                {post.contact && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200">
                        <button onClick={() => setShowContact(true)}
                            className="w-full py-3.5 bg-teal-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5" /> View Contact Details
                        </button>
                    </div>
                )}
            </main>

            {post.contact && <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} contact={post.contact} postTitle={post.title} />}
        </div>
    );
}
