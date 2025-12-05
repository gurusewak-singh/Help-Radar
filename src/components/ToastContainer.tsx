'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { X, Bell, Heart, HelpCircle, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const typeIcons = {
    help_offered: Heart,
    help_requested: HelpCircle,
    new_post: Bell,
    post_resolved: MessageSquare,
    system: AlertCircle
};

const urgencyColors = {
    High: 'bg-red-500',
    Medium: 'bg-amber-500',
    Low: 'bg-teal-500'
};

export default function ToastContainer() {
    const { toasts, dismissToast } = useNotifications();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
            {toasts.map(({ id, notification, visible }) => {
                const Icon = typeIcons[notification.type] || Bell;
                const urgencyColor = notification.urgency ? urgencyColors[notification.urgency] : 'bg-teal-500';

                return (
                    <div
                        key={id}
                        className={`bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                            }`}
                    >
                        {/* Urgency indicator bar */}
                        <div className={`h-1 ${urgencyColor}`} />

                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${urgencyColor} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${notification.urgency === 'High' ? 'text-red-600' : notification.urgency === 'Medium' ? 'text-amber-600' : 'text-teal-600'}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-stone-900 text-sm leading-tight">
                                            {notification.title}
                                        </h4>
                                        <button
                                            onClick={() => dismissToast(id)}
                                            className="p-1 -m-1 text-stone-400 hover:text-stone-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-stone-600 text-sm mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    {notification.postId && (
                                        <Link
                                            href={`/post/${notification.postId}`}
                                            className="inline-block mt-2 text-xs font-medium text-teal-600 hover:text-teal-700"
                                            onClick={() => dismissToast(id)}
                                        >
                                            View Post →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
