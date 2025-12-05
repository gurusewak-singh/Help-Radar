import { Heart, HelpCircle, Search, Gift } from 'lucide-react';

interface CategoryBadgeProps {
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    size?: 'sm' | 'md' | 'lg';
}

const categoryConfig = {
    'Help Needed': {
        icon: HelpCircle,
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/30'
    },
    'Item Lost': {
        icon: Search,
        bgColor: 'bg-amber-500/20',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30'
    },
    'Blood Needed': {
        icon: Heart,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30'
    },
    'Offer': {
        icon: Gift,
        bgColor: 'bg-emerald-500/20',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30'
    }
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
};

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
    const config = categoryConfig[category];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} font-medium`}>
            <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            {category}
        </span>
    );
}
