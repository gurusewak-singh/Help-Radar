'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    icon?: string;
}

interface StyledSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    activeClassName?: string;
}

export default function StyledSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
    activeClassName = '',
}: StyledSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all ${
                    value && activeClassName ? activeClassName : className
                } ${isOpen ? 'ring-2 ring-teal-500/20 border-teal-500' : ''}`}
            >
                <span className="flex items-center gap-2 truncate">
                    {selectedOption?.icon && <span>{selectedOption.icon}</span>}
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 py-2 bg-white border border-stone-200 rounded-xl shadow-xl shadow-stone-200/50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                                    option.value === value
                                        ? 'bg-teal-50 text-teal-700 font-medium'
                                        : 'text-stone-700 hover:bg-stone-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    {option.icon && <span>{option.icon}</span>}
                                    {option.label}
                                </span>
                                {option.value === value && (
                                    <Check className="w-4 h-4 text-teal-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
