'use client';

import Link from 'next/link';
import { Heart, HelpCircle, Search, Gift, ArrowRight, Plus } from 'lucide-react';

const CATEGORIES = [
  { key: 'Blood Needed', label: 'Blood Donation', icon: Heart },
  { key: 'Help Needed', label: 'Community Help', icon: HelpCircle },
  { key: 'Item Lost', label: 'Lost & Found', icon: Search },
  { key: 'Offer', label: 'Offers', icon: Gift },
];

export default function HomePage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
      </div>

      {/* Content - Centered */}
      <div className="relative flex-1 flex flex-col justify-center max-w-5xl mx-auto px-6 pt-16">
        {/* Hero Content */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Your Local Community Network
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Your neighbourhood&apos;s
            <span className="text-teal-200"> helping hand</span>
          </h1>
          <p className="text-lg text-teal-100 mb-6 max-w-xl mx-auto">
            Connect with neighbours, find help when you need it, and build a stronger community together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg"
            >
              Browse Requests
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <Plus className="w-5 h-5" />
              Post a Request
            </Link>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={`/requests?category=${encodeURIComponent(key)}`}
              className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all text-center"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-white text-sm">{label}</p>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10">
          {[
            { value: '156+', label: 'Active' },
            { value: '12K+', label: 'Members' },
            { value: '500+', label: 'Helped' },
            { value: '15+', label: 'Cities' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-teal-200">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
