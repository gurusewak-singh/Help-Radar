'use client';

import Link from 'next/link';
import { Clock, MapPin, Eye, Phone, Mail, AlertTriangle, User } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import UrgencyIndicator from './UrgencyIndicator';

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
    reported?: number;
}

interface PostCardProps {
    post: Post;
    showContact?: boolean;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

function maskPhone(phone: string): string {
    if (phone.length < 6) return phone;
    return phone.slice(0, 2) + '****' + phone.slice(-2);
}

export default function PostCard({ post, showContact = false }: PostCardProps) {
    const hasImage = post.images && post.images.length > 0;

    return (
        <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
            {/* Urgency Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${post.urgency === 'High' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    post.urgency === 'Medium' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                }`} />

            {/* Image */}
            {hasImage && (
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={post.images![0].url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap gap-2">
                        <CategoryBadge category={post.category} />
                        <UrgencyIndicator urgency={post.urgency} />
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views}
                    </div>
                </div>

                {/* Title */}
                <Link href={`/post/${post._id}`}>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                        {post.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {post.description}
                </p>

                {/* Location */}
                <div className="flex items-center text-sm text-slate-400 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 text-purple-400" />
                    <span>{post.city}{post.area ? `, ${post.area}` : ''}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(post.createdAt)}
                    </div>

                    {/* Contact Preview */}
                    {showContact && post.contact && (
                        <div className="flex items-center gap-2">
                            {post.contact.phone && (
                                <a
                                    href={`tel:${post.contact.phone}`}
                                    className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                                >
                                    <Phone className="w-3 h-3" />
                                    {maskPhone(post.contact.phone)}
                                </a>
                            )}
                            {post.contact.email && (
                                <a
                                    href={`mailto:${post.contact.email}`}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors"
                                >
                                    <Mail className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    )}

                    {!showContact && (
                        <Link
                            href={`/post/${post._id}`}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            View Details →
                        </Link>
                    )}
                </div>

                {/* Report indicator */}
                {post.reported && post.reported > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        {post.reported}
                    </div>
                )}
            </div>
        </div>
    );
}
