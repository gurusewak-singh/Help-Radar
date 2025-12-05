import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(email: string, otp: string, name: string) {
    const mailOptions = {
        from: `"HelpRadar" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset OTP - HelpRadar',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0d9488; margin: 0;">HelpRadar</h1>
                    <p style="color: #78716c; margin-top: 5px;">Password Reset Request</p>
                </div>
                
                <p style="color: #44403c; font-size: 16px;">Hi ${name},</p>
                
                <p style="color: #44403c; font-size: 16px;">
                    You requested to reset your password. Use the OTP below to verify your identity:
                </p>
                
                <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
                    <p style="color: rgba(255,255,255,0.8); margin: 0 0 10px 0; font-size: 14px;">Your OTP Code</p>
                    <p style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">
                        ${otp}
                    </p>
                </div>
                
                <p style="color: #78716c; font-size: 14px;">
                    This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
                
                <p style="color: #78716c; font-size: 14px;">
                    If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 30px 0;" />
                
                <p style="color: #a8a29e; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} HelpRadar. All rights reserved.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
