import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user with OTP fields using explicit projection
        const user = await User.findOne(
            { email: email.toLowerCase() },
            { resetOtp: 1, resetOtpExpiry: 1, _id: 1 }
        ).lean();

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid request' },
                { status: 400 }
            );
        }

        // Check if OTP exists and matches
        if (!user.resetOtp || !user.resetOtpExpiry) {
            return NextResponse.json(
                { success: false, message: 'No OTP request found. Please start over.' },
                { status: 400 }
            );
        }

        // Check if OTP expired
        const expiryDate = new Date(user.resetOtpExpiry);
        if (new Date() > expiryDate) {
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

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear OTP
        await User.updateOne(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetOtp: 1, resetOtpExpiry: 1 }
            }
        );

        return NextResponse.json(
            { success: true, message: 'Password reset successful' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
