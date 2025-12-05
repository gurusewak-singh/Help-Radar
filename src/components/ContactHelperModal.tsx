'use client';

import { useState } from 'react';
import { X, Send, Mail, User, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ContactHelperModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
    postTitle: string;
}

export default function ContactHelperModal({ isOpen, onClose, postId, postTitle }: ContactHelperModalProps) {
    const { user, isLoggedIn } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`/api/posts/${postId}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    helperName: name,
                    helperEmail: email,
                    helperPhone: phone || undefined,
                    message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setMessage('');
                }, 2000);
            } else {
                setError(data.message || 'Failed to send message');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-stone-900">Offer Help</h2>
                        <p className="text-sm text-stone-500">Send a message to the person who needs help</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-400" />
                    </button>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">Message Sent!</h3>
                        <p className="text-stone-500">The post creator will receive your message via email.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Post Reference */}
                        <div className="p-3 bg-stone-50 rounded-lg">
                            <p className="text-xs text-stone-400 mb-1">Responding to</p>
                            <p className="text-sm font-medium text-stone-900 line-clamp-2">{postTitle}</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Your Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Your Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Phone <span className="text-stone-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                Your Message *
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi, I'd like to help with your request. I can..."
                                rows={4}
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>

                        <p className="text-xs text-stone-400 text-center">
                            Your contact details will be shared with the post creator so they can respond to you.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
