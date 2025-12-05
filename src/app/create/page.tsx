import CreatePostForm from '@/components/CreatePostForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'New Request — HelpRadar',
    description: 'Post a new community help request'
};

export default function CreatePage() {
    return (
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

                    <div className="bg-white border border-stone-200 rounded-lg p-5 lg:p-6">
                        <CreatePostForm />
                    </div>
                </main>
            </div>
        </div>
    );
}
