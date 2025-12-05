'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FiltersBarProps {
    onFilterChange: (filters: Filters) => void;
    initialFilters: Filters;
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
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(initialFilters.q || '');

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        // Debounce search - only update filters after typing stops
        const timer = setTimeout(() => {
            onFilterChange({ ...initialFilters, q: value });
        }, 300);
        return () => clearTimeout(timer);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ ...initialFilters, q: searchInput });
    };

    const updateFilter = (key: keyof Filters, value: string) => {
        onFilterChange({ ...initialFilters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({ ...initialFilters, city: '', urgency: '' });
    };

    const activeCount = [initialFilters.city, initialFilters.urgency].filter(Boolean).length;

    return (
        <div className="mb-4">
            {/* Compact search bar */}
            <div className="flex gap-2">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </form>
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
                        value={initialFilters.city}
                        onChange={(e) => updateFilter('city', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        {cities.map(c => <option key={c} value={c === 'All' ? '' : c}>{c === 'All' ? 'All Cities' : c}</option>)}
                    </select>
                    <select
                        value={initialFilters.urgency}
                        onChange={(e) => updateFilter('urgency', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        <option value="">All Urgency</option>
                        <option value="High">Urgent Only</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select
                        value={initialFilters.sort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="px-2.5 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-teal-500"
                    >
                        <option value="recent">Recent</option>
                        <option value="priority">Priority</option>
                    </select>
                    {activeCount > 0 && (
                        <button
                            onClick={clearFilters}
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
