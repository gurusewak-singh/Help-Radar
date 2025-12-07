// Skeleton Loading Components for better perceived performance

interface SkeletonProps {
    className?: string;
}

// Base skeleton with shimmer animation
export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-stone-200 rounded ${className}`}
            aria-hidden="true"
        />
    );
}

// Post card skeleton
export function PostCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            {/* Category badge skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
    );
}

// Grid of post card skeletons
export function PostCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Stats card skeleton
export function StatsCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
        </div>
    );
}

// Stats grid skeleton
export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Filter bar skeleton
export function FilterBarSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
            {/* Search input skeleton */}
            <Skeleton className="h-11 w-full rounded-lg" />

            {/* Filter buttons skeleton */}
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

// Hero section skeleton
export function HeroSkeleton() {
    return (
        <div className="text-center py-12 space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
            <div className="flex justify-center gap-4 pt-4">
                <Skeleton className="h-12 w-36 rounded-xl" />
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    );
}

// Map skeleton
export function MapSkeleton() {
    return (
        <div className="w-full h-[500px] bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-200">
            <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-stone-300 border-t-teal-600 rounded-full animate-spin mx-auto" />
                <p className="text-stone-500 text-sm">Loading map...</p>
            </div>
        </div>
    );
}

// Form skeleton
export function FormSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Title input */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-14 w-full rounded-xl" />
        </div>
    );
}

// Table row skeleton
export function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-stone-100">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
        </div>
    );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 bg-stone-50">
                <Skeleton className="h-5 w-32" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <TableRowSkeleton key={i} />
            ))}
        </div>
    );
}

// Page loading skeleton - combines multiple skeletons
export function PageLoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
            <HeroSkeleton />
            <StatsGridSkeleton />
            <FilterBarSkeleton />
            <PostCardSkeletonGrid count={6} />
        </div>
    );
}
