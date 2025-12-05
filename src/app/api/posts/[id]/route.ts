import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { sanitizeText, isValidObjectId } from '@/lib/validators';

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get post detail
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();

        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Increment view count
        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return NextResponse.json({ post });
    } catch (error) {
        console.error('GET /api/posts/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();

        const body = await request.json();

        // Build update object with only allowed fields
        const allowedFields = ['title', 'description', 'category', 'city', 'area', 'urgency', 'status', 'contact', 'images'];
        const updateData: Record<string, unknown> = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === 'title' || field === 'description' || field === 'city' || field === 'area') {
                    updateData[field] = sanitizeText(body[field]);
                } else {
                    updateData[field] = body[field];
                }
            }
        }

        // Update location if coordinates provided
        if (body.lat !== undefined && body.lng !== undefined) {
            updateData.location = {
                type: 'Point',
                coordinates: [body.lng, body.lat]
            };
        }

        const post = await Post.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ post, message: 'Post updated successfully' });
    } catch (error) {
        console.error('PATCH /api/posts/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
        }

        await dbConnect();

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/posts/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
