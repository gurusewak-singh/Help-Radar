import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    title: string;
    description: string;
    category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer';
    city: string;
    area?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    contact: {
        name?: string;
        phone?: string;
        email?: string;
    };
    images: Array<{
        url: string;
        public_id?: string;
    }>;
    urgency: 'Low' | 'Medium' | 'High';
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    expiresAt?: Date;
    status: 'active' | 'resolved' | 'removed';
    views: number;
    reported: number;
    priority: number; // Auto-calculated priority score
}

const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        enum: {
            values: ['Help Needed', 'Item Lost', 'Blood Needed', 'Offer'],
            message: '{VALUE} is not a valid category'
        },
        required: [true, 'Category is required']
    },
    city: {
        type: String,
        index: true,
        required: [true, 'City is required'],
        trim: true
    },
    area: {
        type: String,
        index: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    contact: {
        name: { type: String, trim: true },
        phone: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return !v || /^[+]?[\d\s-]{10,15}$/.test(v);
                },
                message: 'Invalid phone number format'
            }
        },
        email: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Invalid email format'
            }
        }
    },
    images: [{
        url: { type: String, required: true },
        public_id: { type: String }
    }],
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'removed'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    reported: {
        type: Number,
        default: 0
    },
    priority: {
        type: Number,
        default: 0
    }
});

// Indexes for performance
PostSchema.index({ location: '2dsphere' }); // Geo queries
PostSchema.index({ title: 'text', description: 'text' }); // Text search
PostSchema.index({ city: 1, category: 1, urgency: -1 }); // Compound filter
PostSchema.index({ createdAt: -1 }); // Sort by recent
PostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-expiry
PostSchema.index({ status: 1, priority: -1, createdAt: -1 }); // Feed sorting

// Pre-save hook to set expiry and calculate priority
PostSchema.pre('save', function (next) {
    // Set default expiry (7 days from creation)
    if (!this.expiresAt && this.isNew) {
        const expiryDays = parseInt(process.env.POST_EXPIRY_DAYS || '7');
        this.expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    }

    // Calculate priority score
    this.priority = calculatePriority(this);

    next();
});

// Priority calculation function
function calculatePriority(post: IPost): number {
    let score = 0;

    // Urgency weight
    const urgencyScores: Record<string, number> = { 'High': 100, 'Medium': 50, 'Low': 10 };
    score += urgencyScores[post.urgency] || 50;

    // Category weight (Blood Needed is highest priority)
    const categoryScores: Record<string, number> = {
        'Blood Needed': 50,
        'Help Needed': 30,
        'Item Lost': 20,
        'Offer': 10
    };
    score += categoryScores[post.category] || 20;

    // Recency boost (newer posts get higher score)
    const createdTime = post.createdAt ? post.createdAt.getTime() : Date.now();
    const hoursOld = (Date.now() - createdTime) / (1000 * 60 * 60);
    score += Math.max(0, 50 - hoursOld);

    return Math.round(score);
}

// Static method for smart category/urgency suggestion
PostSchema.statics.suggestCategoryAndUrgency = function (title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();

    // Urgency detection
    const highUrgencyKeywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately', 'dying', 'accident', 'hospital'];
    const isHighUrgency = highUrgencyKeywords.some(keyword => text.includes(keyword));

    // Category detection
    const bloodKeywords = ['blood', 'donor', 'a+', 'b+', 'o+', 'ab+', 'a-', 'b-', 'o-', 'ab-', 'transfusion', 'plasma'];
    const lostKeywords = ['lost', 'missing', 'stolen', 'forgot', 'left behind', 'misplaced', 'wallet', 'phone', 'keys'];
    const offerKeywords = ['offer', 'free', 'donate', 'giving away', 'volunteer', 'help available'];

    let suggestedCategory = 'Help Needed';
    if (bloodKeywords.some(kw => text.includes(kw))) {
        suggestedCategory = 'Blood Needed';
    } else if (lostKeywords.some(kw => text.includes(kw))) {
        suggestedCategory = 'Item Lost';
    } else if (offerKeywords.some(kw => text.includes(kw))) {
        suggestedCategory = 'Offer';
    }

    return {
        suggestedCategory,
        suggestedUrgency: isHighUrgency ? 'High' : 'Medium'
    };
};

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
