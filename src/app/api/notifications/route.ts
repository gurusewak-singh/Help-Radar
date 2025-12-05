import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const filter: Record<string, unknown> = { recipientEmail: email };
        if (unreadOnly) {
            filter.isRead = false;
        }

        const skip = (Math.max(1, page) - 1) * limit;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments(filter),
            Notification.countDocuments({ recipientEmail: email, isRead: false })
        ]);

        return NextResponse.json({
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        console.error('GET /api/notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create a notification
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        const { recipientEmail, type, title, message, postId, postTitle, senderName, senderEmail, urgency } = body;

        if (!recipientEmail || !type || !title || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const notification = await Notification.create({
            recipientEmail,
            type,
            title,
            message,
            postId,
            postTitle,
            senderName,
            senderEmail,
            urgency,
            isRead: false
        });

        return NextResponse.json({ notification, message: 'Notification created' }, { status: 201 });
    } catch (error) {
        console.error('POST /api/notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        );
    }
}
