interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'purple' | 'blue' | 'green' | 'amber' | 'red';
}

const colorClasses = {
    purple: {
        bg: 'bg-purple-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        icon: 'bg-purple-500/30'
    },
    blue: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'bg-blue-500/30'
    },
    green: {
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'bg-green-500/30'
    },
    amber: {
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        icon: 'bg-amber-500/30'
    },
    red: {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'bg-red-500/30'
    }
};

export default function StatsCard({ title, value, icon, trend, color = 'purple' }: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className={`${colors.bg} border ${colors.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
                        </p>
                    )}
                </div>
                <div className={`p-3 ${colors.icon} rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
