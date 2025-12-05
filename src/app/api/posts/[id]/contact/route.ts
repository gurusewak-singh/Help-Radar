import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendContactEmail } from '@/lib/email';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { helperName, helperEmail, helperPhone, message } = await request.json();

        if (!helperName || !helperEmail || !message) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(helperEmail)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        // Get creator email - first check contact.email, then try to find by createdBy
        let creatorEmail = post.contact?.email;
        let creatorName = post.contact?.name || 'HelpRadar User';

        if (!creatorEmail && post.createdBy) {
            const creator = await User.findById(post.createdBy);
            if (creator) {
                creatorEmail = creator.email;
                creatorName = creator.name;
            }
        }

        if (!creatorEmail) {
            return NextResponse.json(
                { success: false, message: 'Cannot contact the post creator' },
                { status: 400 }
            );
        }

        // Send the email
        try {
            await sendContactEmail({
                postCreatorEmail: creatorEmail,
                postCreatorName: creatorName,
                postTitle: post.title,
                helperName,
                helperEmail,
                helperPhone,
                message,
            });
        } catch (emailError) {
            console.error('Contact email error:', emailError);
            return NextResponse.json(
                { success: false, message: 'Failed to send email. Please try again.' },
                { status: 500 }
            );
        }

        // Create in-app notification for the post creator
        try {
            await Notification.create({
                recipientEmail: creatorEmail,
                type: 'help_offered',
                title: `${helperName} wants to help!`,
                message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
                postId: post._id,
                postTitle: post.title,
                senderName: helperName,
                senderEmail: helperEmail,
                isRead: false
            });
        } catch (notifError) {
            // Log but don't fail if notification creation fails
            console.error('Notification creation error:', notifError);
        }

        return NextResponse.json(
            { success: true, message: 'Your message has been sent to the post creator!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}

