import CreatePostForm from '@/components/CreatePostForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Create Post - HelpRadar',
    description: 'Create a new help request, lost item report, blood donation request, or offer on HelpRadar.'
};

export default function CreatePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
            </Link>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
                    Create a New Post
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Share your request with the community. Our smart system will help categorize and prioritize your post automatically.
                </p>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="font-medium text-blue-400 mb-1">📍 Be Specific</h4>
                    <p className="text-sm text-slate-400">Include exact location and area for faster local help.</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="font-medium text-amber-400 mb-1">📞 Add Contact</h4>
                    <p className="text-sm text-slate-400">Provide phone or email so helpers can reach you.</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="font-medium text-purple-400 mb-1">✨ Use Keywords</h4>
                    <p className="text-sm text-slate-400">Words like "urgent" or "blood" help auto-prioritize.</p>
                </div>
            </div>

            {/* Form */}
            <CreatePostForm />
        </div>
    );
}
