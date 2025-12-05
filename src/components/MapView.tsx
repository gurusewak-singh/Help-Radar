'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet (client-side only)
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface Post {
    _id: string;
    title: string;
    category: string;
    city: string;
    area?: string;
    urgency: string;
    location?: {
        coordinates: [number, number];
    };
}

interface MapViewProps {
    posts: Post[];
    center?: [number, number];
    zoom?: number;
}

export default function MapView({ posts, center = [20.5937, 78.9629], zoom = 5 }: MapViewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-[500px] bg-slate-800/50 rounded-2xl flex items-center justify-center">
                <div className="text-slate-400">Loading map...</div>
            </div>
        );
    }

    // Filter posts with valid coordinates
    const postsWithLocation = posts.filter(
        post => post.location && post.location.coordinates && post.location.coordinates.length === 2
    );

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'Blood Needed': return '#ef4444';
            case 'Help Needed': return '#3b82f6';
            case 'Item Lost': return '#f59e0b';
            case 'Offer': return '#10b981';
            default: return '#6366f1';
        }
    };

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {postsWithLocation.map((post) => (
                    <Marker
                        key={post._id}
                        position={[post.location!.coordinates[1], post.location!.coordinates[0]]}
                    >
                        <Popup>
                            <div className="p-2">
                                <h4 className="font-bold text-sm mb-1">{post.title}</h4>
                                <p className="text-xs text-gray-600">
                                    {post.city}{post.area ? `, ${post.area}` : ''}
                                </p>
                                <span
                                    className="inline-block px-2 py-0.5 rounded-full text-xs text-white mt-2"
                                    style={{ backgroundColor: getCategoryColor(post.category) }}
                                >
                                    {post.category}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
