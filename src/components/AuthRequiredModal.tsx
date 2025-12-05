'use client';

import { X, LogIn, UserPlus, Heart } from 'lucide-react';
import Link from 'next/link';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    returnUrl?: string;
}

export default function AuthRequiredModal({ isOpen, onClose, message, returnUrl }: AuthRequiredModalProps) {
    if (!isOpen) return null;

    const loginUrl = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';
    const registerUrl = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-8 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Join HelpRadar</h2>
                    <p className="text-teal-100 text-sm">
                        {message || 'Please log in or create an account to continue'}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <Link
                        href={loginUrl}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Log in to your account
                    </Link>

                    <Link
                        href={registerUrl}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Create a new account
                    </Link>

                    <p className="text-center text-xs text-stone-400 pt-2">
                        By continuing, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
