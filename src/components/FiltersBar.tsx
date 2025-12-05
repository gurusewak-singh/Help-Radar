'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

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

const cities = ['All', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'];

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
        const timer = setTimeout(() => onFilterChange(filters), 300);
        return () => clearTimeout(timer);
    }, [filters, onFilterChange]);

    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const activeCount = [filters.city, filters.urgency].filter(Boolean).length;

    return (
        <div className="mb-4">
            {/* Compact search bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filters.q}
                        onChange={(e) => updateFilter('q', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${showFilters || activeCount > 0
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeCount > 0 && <span className="bg-white/20 px-1.5 rounded text-xs">{activeCount}</span>}
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-2 p-3 bg-white border border-stone-200 rounded-lg flex flex-wrap gap-2">
                    <select
                        value={filters.city}
                        onChange={(e) => updateFilter('city', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        {cities.map(c => <option key={c} value={c === 'All' ? '' : c}>{c === 'All' ? 'All Cities' : c}</option>)}
                    </select>
                    <select
                        value={filters.urgency}
                        onChange={(e) => updateFilter('urgency', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        <option value="">All Urgency</option>
                        <option value="High">Urgent Only</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select
                        value={filters.sort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        <option value="recent">Recent</option>
                        <option value="priority">Priority</option>
                    </select>
                    {activeCount > 0 && (
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, city: '', urgency: '' }))}
                            className="px-2.5 py-1.5 text-sm text-stone-500 hover:text-stone-700"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
