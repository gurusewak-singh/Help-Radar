import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';

// GET /api/stats - Get aggregation statistics
export async function GET() {
    try {
        await dbConnect();

        // Category counts
        const categoryCounts = await Post.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Urgency distribution
        const urgencyCounts = await Post.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$urgency', count: { $sum: 1 } } }
        ]);

        // Top cities by requests
        const topCities = await Post.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Top areas (hotspots)
        const hotspots = await Post.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: { city: '$city', area: '$area' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Total counts
        const totalActive = await Post.countDocuments({ status: 'active' });
        const totalResolved = await Post.countDocuments({ status: 'resolved' });
        const totalViews = await Post.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        // Recent activity (last 24 hours)
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentPosts = await Post.countDocuments({
            createdAt: { $gte: last24Hours },
            status: 'active'
        });

        // High urgency posts count
        const highUrgencyCount = await Post.countDocuments({
            status: 'active',
            urgency: 'High'
        });

        return NextResponse.json({
            overview: {
                totalActive,
                totalResolved,
                totalViews: totalViews[0]?.totalViews || 0,
                recentPosts,
                highUrgencyCount
            },
            categoryCounts: categoryCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>),
            urgencyCounts: urgencyCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>),
            topCities: topCities.map(c => ({ city: c._id, count: c.count })),
            hotspots: hotspots.map(h => ({
                city: h._id.city,
                area: h._id.area || 'General',
                count: h.count
            }))
        });
    } catch (error) {
        console.error('GET /api/stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
