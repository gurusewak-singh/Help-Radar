'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, LogOut, Settings, Bell, Heart, MapPin, Shield, ArrowRight } from 'lucide-react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function ProfilePage() {
    const { user, isLoggedIn, isAdmin, isLoading, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        setMounted(true);
        // Teamwork/helping animation
        fetch('https://assets2.lottiefiles.com/packages/lf20_zwn6fmnu.json')
            .then(res => res.json())
            .then(setAnimationData)
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading || !mounted || !isLoggedIn || !user) {
        return (
            <div className="min-h-screen bg-teal-600 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-teal-600">
            <div className="w-full px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* Profile Card */}
                    <div className="w-full lg:w-[55%] bg-white rounded-xl shadow-lg">
                        {/* User Info */}
                        <div className="p-8 text-center border-b border-stone-100">
                            <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="font-semibold text-stone-900">{user.name}</h1>
                            <p className="text-sm text-stone-500">{user.email}</p>
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded">
                                    <Shield className="w-3 h-3" /> Admin
                                </span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex border-b border-stone-100">
                            <div className="flex-1 py-6 text-center">
                                <p className="text-lg font-semibold text-stone-800">0</p>
                                <p className="text-xs text-stone-400">Requests</p>
                            </div>
                            <div className="flex-1 py-6 text-center border-x border-stone-100">
                                <p className="text-lg font-semibold text-stone-800">0</p>
                                <p className="text-xs text-stone-400">Helped</p>
                            </div>
                            <div className="flex-1 py-6 text-center">
                                <p className="text-lg font-semibold text-stone-800">0</p>
                                <p className="text-xs text-stone-400">Found</p>
                            </div>
                        </div>

                        {/* Menu */}
                        <div>
                            <Link href="/requests?mine=true" className="flex items-center justify-between px-6 py-5 hover:bg-stone-50 border-b border-stone-50">
                                <div className="flex items-center gap-3">
                                    <Heart className="w-4 h-4 text-stone-400" />
                                    <span className="text-sm text-stone-600">My Requests</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300" />
                            </Link>
                            <Link href="/map" className="flex items-center justify-between px-6 py-5 hover:bg-stone-50 border-b border-stone-50">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-stone-400" />
                                    <span className="text-sm text-stone-600">Locations</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300" />
                            </Link>
                            <Link href="/profile/notifications" className="flex items-center justify-between px-6 py-5 hover:bg-stone-50 border-b border-stone-50">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4 text-stone-400" />
                                    <span className="text-sm text-stone-600">Notifications</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300" />
                            </Link>
                            <Link href="/profile/settings" className="flex items-center justify-between px-6 py-5 hover:bg-stone-50 border-b border-stone-50">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-stone-400" />
                                    <span className="text-sm text-stone-600">Settings</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-300" />
                            </Link>
                            <button
                                onClick={() => { logout(); router.push('/'); }}
                                className="flex items-center gap-3 w-full px-6 py-5 text-left text-red-500 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Log out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex-1 text-center lg:text-left">
                        {animationData && (
                            <div className="w-96 h-96 mx-auto lg:mx-0">
                                <Lottie animationData={animationData} loop={true} />
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-white mt-4">
                            Your help matters
                        </h2>
                        <p className="text-teal-100 mt-2 max-w-md">
                            Every small act of kindness creates a ripple in our community.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 mt-6 text-white font-medium hover:underline"
                        >
                            Post a request <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
