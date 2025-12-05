import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user with OTP fields using explicit projection
        const user = await User.findOne(
            { email: email.toLowerCase() },
            { resetOtp: 1, resetOtpExpiry: 1, _id: 1 }
        ).lean();

        console.log('Verify OTP - User found:', user ? 'yes' : 'no', 'OTP exists:', user?.resetOtp ? 'yes' : 'no');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid request' },
                { status: 400 }
            );
        }

        // Check if OTP exists
        if (!user.resetOtp || !user.resetOtpExpiry) {
            return NextResponse.json(
                { success: false, message: 'No OTP request found. Please request a new OTP.' },
                { status: 400 }
            );
        }

        // Check if OTP expired
        const expiryDate = new Date(user.resetOtpExpiry);
        if (new Date() > expiryDate) {
            // Clear expired OTP
            await User.updateOne(
                { _id: user._id },
                { $unset: { resetOtp: 1, resetOtpExpiry: 1 } }
            );
            return NextResponse.json(
                { success: false, message: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (user.resetOtp !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // OTP is valid - don't clear it yet, will be cleared on password reset
        return NextResponse.json(
            { success: true, message: 'OTP verified successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
