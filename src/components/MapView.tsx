'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import L from 'leaflet';

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
    distance?: number; // Distance from user in km
}

interface MapViewProps {
    posts: Post[];
    center?: [number, number];
    zoom?: number;
    userLocation?: [number, number] | null; // [lat, lng]
    locationName?: string | null; // User's location name
    onMarkerClick?: (postId: string) => void;
}

// Category colors
const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'Blood Needed': return '#ef4444';
        case 'Help Needed': return '#3b82f6';
        case 'Item Lost': return '#f59e0b';
        case 'Offer': return '#10b981';
        default: return '#6366f1';
    }
};

// Create colored marker icon
const createMarkerIcon = (category: string, urgency: string) => {
    const color = getCategoryColor(category);
    const isUrgent = urgency === 'High';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                position: relative;
                width: 32px;
                height: 32px;
            ">
                ${isUrgent ? `
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 32px;
                        height: 32px;
                        background: ${color};
                        border-radius: 50%;
                        opacity: 0.3;
                        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></div>
                ` : ''}
                <div style="
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 24px;
                    height: 24px;
                    background: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

// User location marker (blue pulsing dot)
const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
        <div style="
            position: relative;
            width: 24px;
            height: 24px;
        ">
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 24px;
                height: 24px;
                background: #0d9488;
                border-radius: 50%;
                opacity: 0.3;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
                position: absolute;
                top: 4px;
                left: 4px;
                width: 16px;
                height: 16px;
                background: #0d9488;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
        </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
});

// Format distance
const formatDistance = (km: number): string => {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
};

export default function MapView({
    posts,
    center = [20.5937, 78.9629],
    zoom = 5,
    userLocation,
    locationName,
    onMarkerClick
}: MapViewProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Add CSS for ping animation
    useEffect(() => {
        if (!mounted) return;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ping {
                75%, 100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [mounted]);

    // Initialize map
    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        // Prevent re-initialization
        if (mapRef.current) return;

        // Initialize the map
        const map = L.map(containerRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
        }).setView(center, zoom);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [mounted, center, zoom]);

    // Update markers when posts change
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mounted) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Filter posts with valid coordinates
        const postsWithLocation = posts.filter(
            post => post.location && post.location.coordinates && post.location.coordinates.length === 2
        );

        // Add markers for each post
        postsWithLocation.forEach((post) => {
            const [lng, lat] = post.location!.coordinates;
            const icon = createMarkerIcon(post.category, post.urgency);
            const marker = L.marker([lat, lng], { icon }).addTo(map);

            const distanceText = post.distance !== undefined
                ? `<p style="font-size: 11px; color: #0d9488; font-weight: 600; margin-bottom: 8px;">📍 ${formatDistance(post.distance)} away</p>`
                : '';

            const urgencyBadge = post.urgency === 'High'
                ? '<span style="display: inline-block; padding: 2px 6px; border-radius: 50px; font-size: 10px; color: #dc2626; background-color: #fef2f2; margin-left: 4px;">Urgent</span>'
                : '';

            marker.bindPopup(`
                <div style="padding: 12px; min-width: 200px; font-family: 'Inter', sans-serif;">
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                        <span style="display: inline-block; padding: 3px 8px; border-radius: 50px; font-size: 11px; color: white; background-color: ${getCategoryColor(post.category)};">
                            ${post.category}
                        </span>
                        ${urgencyBadge}
                    </div>
                    <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #1c1917; line-height: 1.3;">${post.title}</h4>
                    <p style="font-size: 12px; color: #78716c; margin-bottom: 8px;">
                        📍 ${post.city}${post.area ? `, ${post.area}` : ''}
                    </p>
                    ${distanceText}
                    <a href="/post/${post._id}" 
                       style="display: block; text-align: center; padding: 8px 12px; background: #0d9488; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500; margin-top: 8px;">
                        View Details →
                    </a>
                </div>
            `);

            if (onMarkerClick) {
                marker.on('click', () => onMarkerClick(post._id));
            }

            markersRef.current.push(marker);
        });

        // Fit bounds to show all markers if there are any
        if (postsWithLocation.length > 0 && !userLocation) {
            const bounds = L.latLngBounds(
                postsWithLocation.map(p => [p.location!.coordinates[1], p.location!.coordinates[0]])
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [posts, mounted, onMarkerClick, userLocation]);

    // Handle user location marker
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mounted) return;

        // Remove existing user marker
        if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
        }

        // Add user location marker if available
        if (userLocation) {
            const [lat, lng] = userLocation;
            const marker = L.marker([lat, lng], { icon: userLocationIcon }).addTo(map);
            marker.bindPopup(`
                <div style="padding: 10px; text-align: center; font-family: 'Inter', sans-serif; min-width: 150px;">
                    <p style="font-weight: 600; color: #0d9488; margin: 0 0 4px 0; font-size: 14px;">📍 You are here</p>
                    ${locationName ? `<p style="color: #57534e; margin: 0; font-size: 12px;">${locationName}</p>` : ''}
                </div>
            `);
            userMarkerRef.current = marker;

            // Center map on user location
            map.setView([lat, lng], 10);
        }
    }, [userLocation, mounted]);

    // Method to center on user (can be called from parent)
    const centerOnUser = useCallback(() => {
        if (mapRef.current && userLocation) {
            mapRef.current.setView(userLocation, 12, { animate: true });
        }
    }, [userLocation]);

    if (!mounted) {
        return (
            <div className="w-full h-[600px] bg-stone-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-stone-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-stone-500">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-[600px] rounded-2xl overflow-hidden"
            style={{ zIndex: 0 }}
        />
    );
}
