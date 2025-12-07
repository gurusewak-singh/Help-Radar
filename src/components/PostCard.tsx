'use client';

import Link from 'next/link';
import { Clock, MapPin, Eye, ArrowUpRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

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

interface PostCardProps {
    post: Post;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function PostCard({ post }: PostCardProps) {
    const hasImage = post.images && post.images.length > 0;
    const isUrgent = post.urgency === 'High';

    return (
        <article className={`group bg-white rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md ${isUrgent ? 'border-red-300 ring-1 ring-red-100' : 'border-stone-200 hover:border-stone-300'
            }`}>
            <div className="flex flex-col sm:flex-row">
                {/* Image - full width on mobile, compact on desktop */}
                {hasImage && (
                    <div className="relative w-full sm:w-32 lg:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-stone-100">
                        <img
                            src={post.images![0].url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        {isUrgent && (
                            <div className="absolute top-2 left-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Content - tighter padding */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col min-w-0">
                    {/* Top row: badges + urgent indicator */}
                    <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={post.category} />
                        {isUrgent && !hasImage && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Urgent
                            </span>
                        )}
                        {post.urgency === 'Medium' && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                                Medium
                            </span>
                        )}
                    </div>

                    {/* Title - can wrap on mobile */}
                    <h2 className={`font-semibold leading-snug mb-1 line-clamp-2 sm:truncate ${isUrgent ? 'text-red-900' : 'text-stone-900 group-hover:text-teal-700'
                        }`}>
                        <Link href={`/post/${post._id}`}>
                            {post.title}
                        </Link>
                    </h2>

                    {/* Description - 2 lines on mobile, 1 on desktop */}
                    <p className="text-sm text-stone-500 line-clamp-2 sm:truncate mb-2">
                        {post.description}
                    </p>

                    {/* Footer - wrap on mobile */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-stone-400">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {post.city}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                            </span>
                        </div>

                        <Link
                            href={`/post/${post._id}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${isUrgent
                                    ? 'text-white bg-red-600 hover:bg-red-700'
                                    : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                                }`}
                        >
                            {isUrgent ? 'Help' : 'View'}
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
