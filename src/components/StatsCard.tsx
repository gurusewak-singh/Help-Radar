interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-stone-500 text-sm">{title}</span>
                <span className="text-stone-400">{icon}</span>
            </div>
            <p className="text-2xl font-semibold text-stone-900">{value}</p>
        </div>
    );
}
