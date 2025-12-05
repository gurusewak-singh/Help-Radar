'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Eye, Phone, Mail, User, Flag, Share2, CheckCircle, Loader2, AlertTriangle, Heart } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import UrgencyIndicator from '@/components/UrgencyIndicator';
import ContactModal from '@/components/ContactModal';

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
    expiresAt?: string;
    status: string;
}

// Mock post for demo
const MOCK_POST: Post = {
    _id: '1',
    title: 'A+ Blood Donor Urgently Required - City Hospital',
    description: `My father is admitted at City Hospital, Sector 21 and requires A+ blood urgently for surgery.

The surgery is scheduled for tomorrow morning and we need at least 2 units of A+ blood. The blood bank is running low and we are reaching out to the community for help.

**Details:**
- Blood Type: A Positive (A+)
- Hospital: City Hospital, Sector 21
- Required: 2 Units minimum
- When: Before 6 AM tomorrow

Please contact immediately if you can help. The hospital blood bank is open 24/7.

Thank you for your help. May God bless you.`,
    category: 'Blood Needed',
    city: 'Delhi',
    area: 'Sector 21',
    urgency: 'High',
    contact: {
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul.sharma@email.com'
    },
    images: [
        { url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800' }
    ],
    views: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${resolvedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data.post);
                } else {
                    // Use mock post for demo
                    setPost(MOCK_POST);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setPost(MOCK_POST);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [resolvedParams.id]);

    const handleReport = async () => {
        if (!reportReason) return;

        try {
            await fetch(`/api/posts/${resolvedParams.id}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: reportReason })
            });
            setReportSubmitted(true);
            setShowReportForm(false);
        } catch (error) {
            console.error('Failed to submit report:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: post?.title,
                text: post?.description.slice(0, 100) + '...',
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
                <p className="text-slate-400 mb-8">The post you're looking for doesn't exist or has been removed.</p>
                <Link href="/" className="text-purple-400 hover:text-purple-300">
                    ← Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    {post.images && post.images.length > 0 && (
                        <div className="rounded-2xl overflow-hidden border border-white/10">
                            <img
                                src={post.images[0].url}
                                alt={post.title}
                                className="w-full h-64 sm:h-80 object-cover"
                            />
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <CategoryBadge category={post.category} size="lg" />
                            <UrgencyIndicator urgency={post.urgency} size="lg" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                {post.city}{post.area ? `, ${post.area}` : ''}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTimeAgo(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views} views
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            {post.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="text-slate-300 mb-3 last:mb-0">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>

                        {!reportSubmitted ? (
                            <button
                                onClick={() => setShowReportForm(!showReportForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 hover:text-red-400 hover:border-red-500/30 transition-colors"
                            >
                                <Flag className="w-4 h-4" />
                                Report
                            </button>
                        ) : (
                            <span className="flex items-center gap-2 px-4 py-2 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                Report Submitted
                            </span>
                        )}
                    </div>

                    {/* Report Form */}
                    {showReportForm && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Report This Post
                            </h4>
                            <select
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white mb-3"
                            >
                                <option value="">Select a reason</option>
                                <option value="spam">Spam</option>
                                <option value="inappropriate">Inappropriate Content</option>
                                <option value="fake">Fake / Misleading</option>
                                <option value="duplicate">Duplicate Post</option>
                                <option value="other">Other</option>
                            </select>
                            <button
                                onClick={handleReport}
                                disabled={!reportReason}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                            >
                                Submit Report
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Card */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>

                        {post.contact ? (
                            <div className="space-y-4">
                                {post.contact.name && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/20 rounded-lg">
                                            <User className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Posted by</p>
                                            <p className="text-white">{post.contact.name}</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    View Contact Details
                                </button>
                            </div>
                        ) : (
                            <p className="text-slate-400">No contact information provided.</p>
                        )}
                    </div>

                    {/* Post Info */}
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Post Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Posted</dt>
                                <dd className="text-white">{formatDate(post.createdAt)}</dd>
                            </div>
                            {post.expiresAt && (
                                <div className="flex justify-between">
                                    <dt className="text-slate-400">Expires</dt>
                                    <dd className="text-white">{formatDate(post.expiresAt)}</dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Status</dt>
                                <dd className="text-green-400 capitalize">{post.status}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Views</dt>
                                <dd className="text-white">{post.views}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Urgent Banner */}
                    {post.urgency === 'High' && (
                        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 animate-pulse-glow">
                            <div className="flex items-center gap-2 text-red-400 font-medium">
                                <Heart className="w-5 h-5" fill="currentColor" />
                                Urgent Help Needed
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                This is a high-priority request. Please help if you can!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Modal */}
            {post.contact && (
                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                    contact={post.contact}
                    postTitle={post.title}
                />
            )}
        </div>
    );
}
