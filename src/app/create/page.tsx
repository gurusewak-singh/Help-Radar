'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreatePostForm from '@/components/CreatePostForm';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePage() {
    const { isLoggedIn, isLoading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // Show auth modal if user is not logged in (after loading completes)
        if (!isLoading && !isLoggedIn) {
            setShowAuthModal(true);
        }
    }, [isLoading, isLoggedIn]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
                <div className="lg:flex lg:gap-12">
                    {/* Sidebar info */}
                    <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to requests
                            </Link>

                            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Post a Request</h1>
                            <p className="text-stone-500 text-sm mb-8">
                                Share what you need with your community. Be specific about location and urgency for faster responses.
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-lg">
                                    <h4 className="font-medium text-teal-900 text-sm mb-1">Tips for better responses</h4>
                                    <ul className="text-xs text-teal-700 space-y-1">
                                        <li>• Include specific location details</li>
                                        <li>• Add photos if relevant</li>
                                        <li>• Provide contact info</li>
                                        <li>• Set accurate urgency level</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-stone-50 rounded-lg">
                                    <h4 className="font-medium text-stone-700 text-sm mb-1">After posting</h4>
                                    <p className="text-xs text-stone-500">
                                        Your request will be visible to the community immediately. You'll receive notifications when someone responds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Form */}
                    <main className="flex-1 min-w-0">
                        {/* Mobile header */}
                        <div className="lg:hidden mb-6">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-4">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Link>
                            <h1 className="text-xl font-semibold text-stone-900">New Request</h1>
                        </div>

                        {isLoggedIn ? (
                            <div className="bg-white border border-stone-200 rounded-lg p-5 lg:p-6">
                                <CreatePostForm />
                            </div>
                        ) : (
                            <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ArrowLeft className="w-8 h-8 text-stone-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-stone-900 mb-2">Login Required</h3>
                                <p className="text-stone-500 mb-6">You need to be logged in to post a request.</p>
                                <div className="flex gap-3 justify-center">
                                    <Link
                                        href="/login"
                                        className="px-6 py-2.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="You need to log in or create an account to post a help request."
            />
        </>
    );
}
