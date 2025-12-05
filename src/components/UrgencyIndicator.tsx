import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface UrgencyIndicatorProps {
    urgency: 'Low' | 'Medium' | 'High';
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const urgencyConfig = {
    Low: {
        icon: CheckCircle,
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30',
        pulseColor: 'bg-green-500'
    },
    Medium: {
        icon: AlertCircle,
        bgColor: 'bg-amber-500/20',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        pulseColor: 'bg-amber-500'
    },
    High: {
        icon: AlertTriangle,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        pulseColor: 'bg-red-500'
    }
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
};

export default function UrgencyIndicator({ urgency, showLabel = true, size = 'md' }: UrgencyIndicatorProps) {
    const config = urgencyConfig[urgency];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} font-medium`}>
            {urgency === 'High' && (
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseColor}`}></span>
                </span>
            )}
            {urgency !== 'High' && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
            {showLabel && urgency}
        </span>
    );
}
