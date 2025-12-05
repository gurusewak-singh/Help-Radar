'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, AlertTriangle, ArrowUpDown, X } from 'lucide-react';
import StyledSelect from './StyledSelect';

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

const cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Lucknow', label: 'Lucknow' },
];

const urgencyOptions = [
    { value: '', label: 'All Urgency' },
    { value: 'High', label: 'Urgent Only', icon: '🔴' },
    { value: 'Medium', label: 'Medium', icon: '🟡' },
    { value: 'Low', label: 'Low', icon: '🟢' },
];

const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'priority', label: 'Highest Priority' },
];

export default function FiltersBar({ onFilterChange, initialFilters }: FiltersBarProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(initialFilters.q || '');

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
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
        onFilterChange({ ...initialFilters, city: '', urgency: '', sort: 'recent' });
    };

    const activeCount = [initialFilters.city, initialFilters.urgency].filter(Boolean).length;

    return (
        <div className="mb-6">
            {/* Search and Filter Toggle */}
            <div className="flex gap-3">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-stone-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-14 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
                    />
                </form>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm ${
                        showFilters || activeCount > 0
                            ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-teal-500/25'
                            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {/* <span className="hidden sm:inline"></span> */}
                    {activeCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            showFilters || activeCount > 0 ? 'bg-white/20' : 'bg-teal-100 text-teal-700'
                        }`}>
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Expanded Filters Panel */}
            {showFilters && (
                <div className="mt-4 p-5 bg-white border border-stone-200 rounded-2xl shadow-lg shadow-stone-200/50">
                    <div className="flex flex-wrap gap-4">
                        {/* Sort Filter */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                Sort By
                            </label>
                            <StyledSelect
                                options={sortOptions}
                                value={initialFilters.sort}
                                onChange={(value) => updateFilter('sort', value)}
                                className="bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                            />
                        </div>

                        {/* City Filter */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                City
                            </label>
                            <StyledSelect
                                options={cityOptions}
                                value={initialFilters.city}
                                onChange={(value) => updateFilter('city', value)}
                                className="bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                                activeClassName="bg-teal-50 border-teal-200 text-teal-700"
                            />
                        </div>

                        {/* Urgency Filter */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Urgency
                            </label>
                            <StyledSelect
                                options={urgencyOptions}
                                value={initialFilters.urgency}
                                onChange={(value) => updateFilter('urgency', value)}
                                className="bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                                activeClassName={
                                    initialFilters.urgency === 'High' ? 'bg-red-50 border-red-200 text-red-700' :
                                    initialFilters.urgency === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                    initialFilters.urgency === 'Low' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                    'bg-stone-50 border-stone-200 text-stone-700'
                                }
                            />
                        </div>

                        {/* Clear Button */}
                        {activeCount > 0 && (
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Active Filters Tags */}
                    {activeCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
                            <span className="text-xs text-stone-400 py-1">Active:</span>
                            {initialFilters.city && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                                    <MapPin className="w-3 h-3" />
                                    {initialFilters.city}
                                    <button onClick={() => updateFilter('city', '')} className="hover:bg-teal-100 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {initialFilters.urgency && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                    initialFilters.urgency === 'High' ? 'bg-red-50 text-red-700' :
                                    initialFilters.urgency === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                    'bg-blue-50 text-blue-700'
                                }`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    {initialFilters.urgency}
                                    <button onClick={() => updateFilter('urgency', '')} className="hover:opacity-70 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
