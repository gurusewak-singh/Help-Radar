import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    recipientEmail: string;
    type: 'help_offered' | 'help_requested' | 'new_post' | 'post_resolved' | 'system';
    title: string;
    message: string;
    postId?: mongoose.Types.ObjectId;
    postTitle?: string;
    senderId?: mongoose.Types.ObjectId;
    senderName?: string;
    senderEmail?: string;
    isRead: boolean;
    urgency?: 'Low' | 'Medium' | 'High';
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    recipientEmail: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['help_offered', 'help_requested', 'new_post', 'post_resolved', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    postTitle: {
        type: String
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    senderName: {
        type: String
    },
    senderEmail: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
NotificationSchema.index({ recipientEmail: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

// Auto-delete old notifications (30 days)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Static method to create help offered notification
NotificationSchema.statics.createHelpOfferedNotification = async function (
    recipientEmail: string,
    postId: string,
    postTitle: string,
    helperName: string,
    helperEmail: string,
    message: string
) {
    return this.create({
        recipientEmail,
        type: 'help_offered',
        title: `${helperName} wants to help!`,
        message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
        postId,
        postTitle,
        senderName: helperName,
        senderEmail: helperEmail,
        isRead: false
    });
};

// Static method to create new post notification
NotificationSchema.statics.createNewPostNotification = async function (
    recipientEmail: string,
    postId: string,
    postTitle: string,
    category: string,
    urgency: string,
    city: string,
    creatorName: string
) {
    const urgencyLabel = urgency === 'High' ? '🚨 URGENT' : urgency === 'Medium' ? '⚠️' : '📢';
    return this.create({
        recipientEmail,
        type: 'new_post',
        title: `${urgencyLabel} New ${category} in ${city}`,
        message: postTitle.substring(0, 200),
        postId,
        postTitle,
        senderName: creatorName,
        urgency,
        isRead: false
    });
};

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
