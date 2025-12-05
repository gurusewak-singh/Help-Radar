import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'user' | 'admin';
    trustScore: number;
    subscribedCities: string[];
    subscribedCategories: string[];
    notificationPreferences: {
        email: boolean;
        bloodAlerts: boolean;
        helpAlerts: boolean;
    };
    createdAt: Date;
    lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include in queries by default
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    trustScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    subscribedCities: [{
        type: String,
        trim: true
    }],
    subscribedCategories: [{
        type: String,
        enum: ['Help Needed', 'Item Lost', 'Blood Needed', 'Offer']
    }],
    notificationPreferences: {
        email: { type: Boolean, default: true },
        bloodAlerts: { type: Boolean, default: true },
        helpAlerts: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ subscribedCities: 1 });
UserSchema.index({ role: 1 });

// Method to increment trust score
UserSchema.methods.incrementTrustScore = async function (amount: number = 1) {
    this.trustScore = Math.min(100, this.trustScore + amount);
    await this.save();
};

// Static method to find subscribers for a city and category
UserSchema.statics.findSubscribers = async function (city: string, category: string) {
    return this.find({
        subscribedCities: city,
        subscribedCategories: category,
        'notificationPreferences.email': true
    }).select('email name');
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
