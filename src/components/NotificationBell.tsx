'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Check, CheckCheck, Heart, HelpCircle, MessageSquare, AlertCircle, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
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

export default function NotificationBell() {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (id: string, isRead: boolean) => {
        if (!isRead) {
            await markAsRead(id);
        }
    };

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-teal-600" />
                            <h3 className="font-semibold text-stone-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading && notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                                <p className="text-stone-500 text-sm">No notifications yet</p>
                                <p className="text-stone-400 text-xs mt-1">We&apos;ll notify you when something happens</p>
                            </div>
                        ) : (
                            recentNotifications.map(notification => {
                                const Icon = typeIcons[notification.type] || Bell;
                                const colorClass = typeColors[notification.type] || 'text-teal-600 bg-teal-100';

                                return (
                                    <div
                                        key={notification._id}
                                        className={`block border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors ${!notification.isRead ? 'bg-teal-50/50' : ''
                                            }`}
                                    >
                                        <Link
                                            href={notification.postId ? `/post/${notification.postId}` : '/profile/notifications'}
                                            onClick={() => handleNotificationClick(notification._id, notification.isRead)}
                                            className="flex items-start gap-3 p-4"
                                        >
                                            <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-stone-400 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <Link
                            href="/profile/notifications"
                            className="block px-4 py-3 text-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-stone-50 border-t border-stone-200 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                            <ChevronRight className="w-4 h-4 inline ml-1" />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
