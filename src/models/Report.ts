import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
    postId: mongoose.Types.ObjectId;
    reason: 'spam' | 'inappropriate' | 'fake' | 'duplicate' | 'other';
    description?: string;
    reportedBy?: mongoose.Types.ObjectId;
    reporterEmail?: string;
    status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
    createdAt: Date;
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    actionTaken?: string;
}

const ReportSchema = new Schema<IReport>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required']
    },
    reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'fake', 'duplicate', 'other'],
        required: [true, 'Report reason is required']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reporterEmail: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'dismissed', 'action_taken'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    actionTaken: {
        type: String
    }
});

// Indexes
ReportSchema.index({ postId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reportedBy: 1 });

// Static method to count reports for a post
ReportSchema.statics.countForPost = async function (postId: mongoose.Types.ObjectId) {
    return this.countDocuments({ postId, status: { $ne: 'dismissed' } });
};

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
