'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, List, MapPin, Heart, HelpCircle, Search, Gift, Navigation, Eye, Locate, Loader2, AlertCircle } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import { MapSkeleton } from '@/components/Skeletons';

// Lazy load Leaflet CSS only when this page is loaded
const loadLeafletCSS = () => {
    if (typeof window !== 'undefined' && !document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
    }
};

// Dynamic import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => <MapSkeleton />
});

interface Post {
    _id: string;
    title: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    area?: string;
    urgency: 'Low' | 'Medium' | 'High';
    location?: {
        coordinates: [number, number];
    };
    distance?: number;
}

// Mock data with coordinates
const MOCK_POSTS: Post[] = [
    {
        _id: '1',
        title: 'A+ Blood Donor Urgently Required',
        category: 'Blood Needed',
        city: 'Delhi',
        area: 'Sector 21',
        urgency: 'High',
        location: { coordinates: [77.2090, 28.6139] }
    },
    {
        _id: '2',
        title: 'Lost Black Wallet',
        category: 'Item Lost',
        city: 'Bangalore',
        area: 'MG Road',
        urgency: 'Medium',
        location: { coordinates: [77.6197, 12.9716] }
    },
    {
        _id: '3',
        title: 'Senior Citizen Needs Grocery',
        category: 'Help Needed',
        city: 'Mumbai',
        area: 'Andheri West',
        urgency: 'Medium',
        location: { coordinates: [72.8777, 19.0760] }
    },
    {
        _id: '4',
        title: 'Free Tutoring Available',
        category: 'Offer',
        city: 'Chennai',
        area: 'T. Nagar',
        urgency: 'Low',
        location: { coordinates: [80.2707, 13.0827] }
    },
    {
        _id: '5',
        title: 'O- Blood Needed Emergency',
        category: 'Blood Needed',
        city: 'Hyderabad',
        area: 'Jubilee Hills',
        urgency: 'High',
        location: { coordinates: [78.4867, 17.3850] }
    },
    {
        _id: '6',
        title: 'Volunteers for Flood Relief',
        category: 'Help Needed',
        city: 'Kolkata',
        area: 'Salt Lake',
        urgency: 'High',
        location: { coordinates: [88.3639, 22.5726] }
    },
    {
        _id: '7',
        title: 'Lost Pet Dog Bruno',
        category: 'Item Lost',
        city: 'Pune',
        area: 'Koregaon Park',
        urgency: 'High',
        location: { coordinates: [73.8567, 18.5204] }
    },
    {
        _id: '8',
        title: 'Free Medical Camp',
        category: 'Offer',
        city: 'Jaipur',
        area: 'Pink City',
        urgency: 'Low',
        location: { coordinates: [75.7873, 26.9124] }
    }
];

const CATEGORIES = [
    { value: '', label: 'All', icon: MapPin, color: 'teal' },
    { value: 'Blood Needed', label: 'Blood Needed', icon: Heart, color: 'red' },
    { value: 'Help Needed', label: 'Help Needed', icon: HelpCircle, color: 'blue' },
    { value: 'Item Lost', label: 'Lost & Found', icon: Search, color: 'amber' },
    { value: 'Offer', label: 'Offers', icon: Gift, color: 'emerald' },
];

const getCategoryStyles = (category: string, isActive: boolean) => {
    const styles: Record<string, { active: string; inactive: string }> = {
        '': {
            active: 'bg-teal-600 text-white shadow-md',
            inactive: 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-600'
        },
        'Blood Needed': {
            active: 'bg-red-50 border-2 border-red-200 text-red-700',
            inactive: 'bg-white border border-stone-200 text-stone-600 hover:border-red-200 hover:text-red-600'
        },
        'Help Needed': {
            active: 'bg-blue-50 border-2 border-blue-200 text-blue-700',
            inactive: 'bg-white border border-stone-200 text-stone-600 hover:border-blue-200 hover:text-blue-600'
        },
        'Item Lost': {
            active: 'bg-amber-50 border-2 border-amber-200 text-amber-700',
            inactive: 'bg-white border border-stone-200 text-stone-600 hover:border-amber-200 hover:text-amber-600'
        },
        'Offer': {
            active: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-700',
            inactive: 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-200 hover:text-emerald-600'
        },
    };
    return isActive ? styles[category]?.active : styles[category]?.inactive;
};

const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
        case 'High':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Urgent</span>;
        case 'Medium':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Medium</span>;
        default:
            return null;
    }
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Format distance for display
const formatDistance = (km: number): string => {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    } else if (km < 10) {
        return `${km.toFixed(1)}km`;
    } else {
        return `${Math.round(km)}km`;
    }
};

export default function MapPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showList, setShowList] = useState(true);

    // Geolocation state
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Reverse geocoding to get location name
    const fetchLocationName = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
                { headers: { 'Accept-Language': 'en' } }
            );
            if (response.ok) {
                const data = await response.json();
                const address = data.address;
                // Build a readable location name
                const parts = [];
                if (address.suburb || address.neighbourhood) {
                    parts.push(address.suburb || address.neighbourhood);
                }
                if (address.city || address.town || address.village) {
                    parts.push(address.city || address.town || address.village);
                }
                if (parts.length === 0 && address.state) {
                    parts.push(address.state);
                }
                setLocationName(parts.join(', ') || 'Unknown location');
            }
        } catch (error) {
            console.error('Failed to fetch location name:', error);
            setLocationName(null);
        }
    };

    // Fetch posts and lazy load Leaflet CSS
    useEffect(() => {
        // Lazy load Leaflet CSS
        loadLeafletCSS();

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts?limit=100');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts);
                } else {
                    setPosts(MOCK_POSTS);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                setPosts(MOCK_POSTS);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Get user's current location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setLocationLoading(false);
                // Fetch the location name
                fetchLocationName(latitude, longitude);
            },
            (error) => {
                setLocationLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location permission denied. Please enable location access.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location unavailable. Please try again.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out. Please try again.');
                        break;
                    default:
                        setLocationError('Unable to get your location.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // Cache for 5 minutes
            }
        );
    };

    // Calculate distances and sort posts
    const postsWithDistance = useMemo(() => {
        if (!userLocation) return posts;

        return posts.map(post => {
            if (!post.location?.coordinates) return post;

            const [lng, lat] = post.location.coordinates;
            const distance = calculateDistance(
                userLocation[0],
                userLocation[1],
                lat,
                lng
            );

            return { ...post, distance };
        });
    }, [posts, userLocation]);

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let result = selectedCategory
            ? postsWithDistance.filter(p => p.category === selectedCategory)
            : postsWithDistance;

        // Sort by distance if user location is available
        if (userLocation) {
            result = [...result].sort((a, b) => {
                if (a.distance === undefined) return 1;
                if (b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
        }

        return result;
    }, [postsWithDistance, selectedCategory, userLocation]);

    const postsWithLocation = filteredPosts.filter(p => p.location);

    // Calculate category counts
    const categoryCounts = posts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen bg-stone-50 pt-8">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <Link
                                href="/requests"
                                className="inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 transition-colors text-sm mb-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Requests
                            </Link>
                            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-teal-600" />
                                </div>
                                Map View
                            </h1>
                            <p className="text-stone-500 mt-1">Find help requests near you</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Find My Location Button */}
                            <button
                                onClick={getUserLocation}
                                disabled={locationLoading}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${userLocation
                                    ? 'bg-teal-50 border border-teal-200 text-teal-700'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-600'
                                    } ${locationLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {locationLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Locate className="w-4 h-4" />
                                )}
                                {userLocation ? 'Located' : 'Find Me'}
                            </button>

                            <button
                                onClick={() => setShowList(!showList)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${showList
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                {showList ? 'Hide List' : 'Show List'}
                            </button>
                            <Link
                                href="/create"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
                            >
                                Post Request
                            </Link>
                        </div>
                    </div>

                    {/* Location Error Message */}
                    {locationError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {locationError}
                        </div>
                    )}

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {CATEGORIES.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setSelectedCategory(value)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${getCategoryStyles(value, selectedCategory === value)}`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {value && categoryCounts[value] && (
                                    <span className="ml-1 text-xs opacity-70">({categoryCounts[value]})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-stone-900">{postsWithLocation.length}</p>
                                <p className="text-xs text-stone-500">On Map</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-stone-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-4 h-4 text-stone-500" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-stone-900">{filteredPosts.length}</p>
                                <p className="text-xs text-stone-500">Total Results</p>
                            </div>
                        </div>
                        {userLocation && (
                            <>
                                <div className="h-8 w-px bg-stone-200"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                        <Locate className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-teal-700">
                                            {locationName ? `📍 ${locationName}` : 'Location Active'}
                                        </p>
                                        <p className="text-xs text-stone-500">Sorted by proximity</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-xs text-stone-400 uppercase tracking-wide font-medium">Legend:</span>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-stone-600">Blood</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-stone-600">Help</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-stone-600">Lost</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-stone-600">Offer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className={showList ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="w-full h-[600px] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-sm text-stone-500">Loading requests...</p>
                                    </div>
                                </div>
                            ) : (
                                <MapView
                                    posts={postsWithLocation}
                                    userLocation={userLocation}
                                    locationName={locationName}
                                />
                            )}
                        </div>

                        {/* Mobile Legend */}
                        <div className="md:hidden mt-4 p-4 bg-white rounded-xl border border-stone-200">
                            <h4 className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-3">Map Legend</h4>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-stone-600">Blood Needed</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-stone-600">Help Needed</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-stone-600">Item Lost</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-stone-600">Offer</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side List */}
                    {showList && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden sticky top-24">
                                <div className="p-4 border-b border-stone-100 bg-stone-50">
                                    <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-teal-600" />
                                        {userLocation ? 'Nearest Requests' : 'Nearby Requests'}
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-1">
                                        {postsWithLocation.length} locations found
                                        {userLocation && ' • Sorted by distance'}
                                    </p>
                                </div>
                                <div className="max-h-[540px] overflow-y-auto">
                                    {postsWithLocation.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <MapPin className="w-6 h-6 text-stone-400" />
                                            </div>
                                            <p className="text-stone-500 text-sm">No requests with location data</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-stone-100">
                                            {postsWithLocation.map(post => (
                                                <Link
                                                    key={post._id}
                                                    href={`/post/${post._id}`}
                                                    className="block p-4 hover:bg-stone-50 transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                                <CategoryBadge category={post.category} />
                                                                {getUrgencyBadge(post.urgency)}
                                                                {post.distance !== undefined && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                                                                        📍 {formatDistance(post.distance)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="text-sm font-medium text-stone-900 line-clamp-2">{post.title}</h4>
                                                            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {post.city}{post.area ? `, ${post.area}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
