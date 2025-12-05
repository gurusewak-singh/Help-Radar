import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendOtpEmail, generateOtp } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user by email (include password to check if it's a Google-only account)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            // Don't reveal if email exists for security
            return NextResponse.json(
                { success: true, message: 'If an account exists, an OTP has been sent' },
                { status: 200 }
            );
        }

        // Check if user registered with Google only (no password)
        if (!user.password && user.googleId) {
            return NextResponse.json(
                { success: false, message: 'This account uses Google sign-in. Please use Google to log in.' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        await User.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetOtp: otp, 
                    resetOtpExpiry: otpExpiry 
                } 
            }
        );

        // Send email
        try {
            await sendOtpEmail(user.email, otp, user.name);
        } catch (emailError) {
            console.error('Email send error:', emailError);
            return NextResponse.json(
                { success: false, message: 'Failed to send email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'OTP sent to your email' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
