import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import Report from '@/models/Report';
import { isValidObjectId, sanitizeText, checkRateLimit } from '@/lib/validators';

interface RouteContext {
    params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/report - Report a post
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        // Rate limiting for reports
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip, 3, 60000)) {
            return NextResponse.json(
                { error: 'Too many report requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();

        // Check if post exists
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const body = await request.json();

        // Validate report data
        const validReasons = ['spam', 'inappropriate', 'fake', 'duplicate', 'other'];
        if (!body.reason || !validReasons.includes(body.reason)) {
            return NextResponse.json(
                { error: 'Valid reason is required (spam, inappropriate, fake, duplicate, other)' },
                { status: 400 }
            );
        }

        // Create report
        const report = new Report({
            postId: id,
            reason: body.reason,
            description: body.description ? sanitizeText(body.description) : undefined,
            reporterEmail: body.email,
            status: 'pending'
        });

        await report.save();

        // Increment report count on post
        await Post.findByIdAndUpdate(id, { $inc: { reported: 1 } });

        // Auto-hide post if too many reports (threshold: 5)
        const reportCount = await Report.countDocuments({ postId: id, status: { $ne: 'dismissed' } });
        if (reportCount >= 5) {
            await Post.findByIdAndUpdate(id, { status: 'removed' });
        }

        return NextResponse.json({
            message: 'Report submitted successfully',
            reportId: report._id
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/posts/[id]/report error:', error);
        return NextResponse.json(
            { error: 'Failed to submit report' },
            { status: 500 }
        );
    }
}
