import { AlertCircle } from 'lucide-react';

interface UrgencyIndicatorProps {
    urgency: 'Low' | 'Medium' | 'High';
}

export default function UrgencyIndicator({ urgency }: UrgencyIndicatorProps) {
    if (urgency !== 'High') return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Urgent
        </span>
    );
}
