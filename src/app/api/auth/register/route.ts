import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            trustScore: 0,
            subscribedCities: [],
            subscribedCategories: [],
            notificationPreferences: {
                email: true,
                bloodAlerts: true,
                helpAlerts: false
            }
        });

        // Return user data (exclude password)
        return NextResponse.json({
            success: true,
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
