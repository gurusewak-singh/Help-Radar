'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, X, ArrowUpDown } from 'lucide-react';

interface FiltersBarProps {
    onFilterChange: (filters: Filters) => void;
    initialFilters?: Filters;
}

export interface Filters {
    city: string;
    category: string;
    urgency: string;
    q: string;
    sort: string;
}

const categories = ['All Categories', 'Help Needed', 'Item Lost', 'Blood Needed', 'Offer'];
const urgencies = ['All Urgency', 'High', 'Medium', 'Low'];
const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'priority', label: 'Priority' },
    { value: 'oldest', label: 'Oldest First' },
];

const popularCities = [
    'All Cities',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow'
];

export default function FiltersBar({ onFilterChange, initialFilters }: FiltersBarProps) {
    const [filters, setFilters] = useState<Filters>({
        city: initialFilters?.city || '',
        category: initialFilters?.category || '',
        urgency: initialFilters?.urgency || '',
        q: initialFilters?.q || '',
        sort: initialFilters?.sort || 'recent'
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const debounce = setTimeout(() => {
            onFilterChange(filters);
        }, 300);
        return () => clearTimeout(debounce);
    }, [filters, onFilterChange]);

    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            city: '',
            category: '',
            urgency: '',
            q: '',
            sort: 'recent'
        });
    };

    const activeFiltersCount = [filters.city, filters.category, filters.urgency].filter(Boolean).length;

    return (
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            {/* Search Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={filters.q}
                        onChange={(e) => updateFilter('q', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters || activeFiltersCount > 0
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-700/50'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                    {/* City */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filters.city}
                            onChange={(e) => updateFilter('city', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                        >
                            {popularCities.map(city => (
                                <option key={city} value={city === 'All Cities' ? '' : city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <select
                        value={filters.category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Urgency */}
                    <select
                        value={filters.urgency}
                        onChange={(e) => updateFilter('urgency', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                    >
                        {urgencies.map(urg => (
                            <option key={urg} value={urg === 'All Urgency' ? '' : urg}>
                                {urg}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <span className="text-sm text-slate-400">Active:</span>
                    {filters.city && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                            {filters.city}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-white"
                                onClick={() => updateFilter('city', '')}
                            />
                        </span>
                    )}
                    {filters.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                            {filters.category}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-white"
                                onClick={() => updateFilter('category', '')}
                            />
                        </span>
                    )}
                    {filters.urgency && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                            {filters.urgency}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-white"
                                onClick={() => updateFilter('urgency', '')}
                            />
                        </span>
                    )}
                    <button
                        onClick={clearFilters}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
