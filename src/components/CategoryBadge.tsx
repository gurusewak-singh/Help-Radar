import { Heart, HelpCircle, Search, Gift } from 'lucide-react';

interface CategoryBadgeProps {
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
}

const config = {
    'Help Needed': { icon: HelpCircle, bg: 'bg-blue-50', text: 'text-blue-700' },
    'Item Lost': { icon: Search, bg: 'bg-amber-50', text: 'text-amber-700' },
    'Blood Needed': { icon: Heart, bg: 'bg-red-50', text: 'text-red-700' },
    'Offer': { icon: Gift, bg: 'bg-emerald-50', text: 'text-emerald-700' }
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
    const { icon: Icon, bg, text } = config[category];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>
            <Icon className="w-3 h-3" />
            {category}
        </span>
    );
}
