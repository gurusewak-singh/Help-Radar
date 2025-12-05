'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Check, CheckCheck, Heart, HelpCircle, MessageSquare, AlertCircle, ArrowLeft, Filter, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
    help_offered: Heart,
    help_requested: HelpCircle,
    new_post: Bell,
    post_resolved: MessageSquare,
    system: AlertCircle
};

const typeColors = {
    help_offered: 'text-rose-600 bg-rose-100',
    help_requested: 'text-blue-600 bg-blue-100',
    new_post: 'text-teal-600 bg-teal-100',
    post_resolved: 'text-emerald-600 bg-emerald-100',
    system: 'text-amber-600 bg-amber-100'
};

const typeLabels = {
    help_offered: 'Help Offered',
    help_requested: 'Help Requested',
    new_post: 'New Post',
    post_resolved: 'Resolved',
    system: 'System'
};

export default function NotificationsPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [authLoading, isLoggedIn, router]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [isLoggedIn, fetchNotifications]);

    if (authLoading || !mounted || !isLoggedIn) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    return (
        <div className="min-h-screen bg-stone-50 pt-20 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 transition-colors text-sm mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <Bell className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-stone-900">Notifications</h1>
                                <p className="text-stone-500 text-sm">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-stone-900 text-white'
                                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${filter === 'unread'
                                ? 'bg-stone-900 text-white'
                                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                            }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${filter === 'unread' ? 'bg-white/20' : 'bg-teal-100 text-teal-700'
                                }`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-stone-700 mb-1">
                                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                            </h3>
                            <p className="text-stone-500 text-sm">
                                {filter === 'unread'
                                    ? 'You\'ve read all your notifications'
                                    : 'We\'ll notify you when something happens'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-100">
                            {filteredNotifications.map(notification => {
                                const Icon = typeIcons[notification.type] || Bell;
                                const colorClass = typeColors[notification.type] || 'text-teal-600 bg-teal-100';
                                const label = typeLabels[notification.type] || 'Notification';

                                return (
                                    <div
                                        key={notification._id}
                                        className={`p-5 hover:bg-stone-50 transition-colors ${!notification.isRead ? 'bg-teal-50/40' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-11 h-11 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                                                                {label}
                                                            </span>
                                                            {!notification.isRead && (
                                                                <span className="w-2 h-2 bg-teal-500 rounded-full" />
                                                            )}
                                                        </div>
                                                        <h3 className={`font-semibold leading-tight ${!notification.isRead ? 'text-stone-900' : 'text-stone-700'
                                                            }`}>
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-stone-600 text-sm mt-1">
                                                            {notification.message}
                                                        </p>
                                                        {notification.postTitle && (
                                                            <p className="text-stone-400 text-xs mt-2 truncate">
                                                                Re: {notification.postTitle}
                                                            </p>
                                                        )}
                                                        <p className="text-stone-400 text-xs mt-2">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => markAsRead(notification._id)}
                                                                className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {notification.postId && (
                                                            <Link
                                                                href={`/post/${notification.postId}`}
                                                                className="px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                                                            >
                                                                View Post
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
