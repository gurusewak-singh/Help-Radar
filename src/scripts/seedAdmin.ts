import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

// Admin seeder configuration
const ADMIN_USERS = [
    {
        name: 'HelpRadar Admin',
        email: 'admin@helpradar.com',
        password: 'admin123',   
        role: 'admin',
        trustScore: 100,
    },
    {
        name: 'Guru Admin',
        email: 'guruop.gsb@gmail.com',
        password: 'admin123',
        role: 'admin',
        trustScore: 100,
    },
];

async function seedAdmins() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI environment variable is not set');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const collection = mongoose.connection.collection('users');

        // Drop old username index if it exists
        try {
            await collection.dropIndex('username_1');
            console.log('🧹 Dropped old username index');
        } catch {
            // Index doesn't exist
        }

        console.log('🌱 Seeding admin users...\n');

        for (const admin of ADMIN_USERS) {
            const result = await collection.updateOne(
                { email: admin.email },
                {
                    $set: {
                        name: admin.name,
                        email: admin.email,
                        password: admin.password,
                        role: admin.role,
                        trustScore: admin.trustScore,
                        notificationPreferences: {
                            email: true,
                            bloodAlerts: true,
                            helpAlerts: true,
                        },
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                        subscribedCities: [],
                        subscribedCategories: [],
                    }
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                console.log(`✅ Created: ${admin.email}`);
            } else {
                console.log(`✅ Updated: ${admin.email}`);
            }
        }

        console.log('\n✨ Admin seeding complete!');
        console.log('\n⚠️  Remember to change default passwords in production!\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📤 Disconnected from MongoDB');
    }
}

seedAdmins();
