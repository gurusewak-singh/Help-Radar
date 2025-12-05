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

interface ContactEmailParams {
    postCreatorEmail: string;
    postCreatorName: string;
    postTitle: string;
    helperName: string;
    helperEmail: string;
    helperPhone?: string;
    message: string;
}

export async function sendContactEmail(params: ContactEmailParams) {
    const { postCreatorEmail, postCreatorName, postTitle, helperName, helperEmail, helperPhone, message } = params;
    
    const mailOptions = {
        from: `"HelpRadar" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to: postCreatorEmail,
        replyTo: helperEmail,
        subject: `🤝 Someone wants to help: ${postTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0d9488; margin: 0;">HelpRadar</h1>
                    <p style="color: #78716c; margin-top: 5px;">Someone wants to help!</p>
                </div>
                
                <p style="color: #44403c; font-size: 16px;">Hi ${postCreatorName},</p>
                
                <p style="color: #44403c; font-size: 16px;">
                    Great news! Someone from the HelpRadar community has offered to help with your request:
                </p>
                
                <div style="background: #f5f5f4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
                    <p style="color: #78716c; font-size: 12px; margin: 0 0 5px 0;">YOUR REQUEST</p>
                    <p style="color: #44403c; font-size: 16px; font-weight: 600; margin: 0;">${postTitle}</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #0d9488, #059669); padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">MESSAGE FROM HELPER</p>
                    <p style="color: white; font-size: 16px; line-height: 1.6; margin: 0;">
                        ${message.replace(/\n/g, '<br>')}
                    </p>
                </div>
                
                <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 15px 0;">📞 HELPER'S CONTACT DETAILS</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="color: #78716c; padding: 5px 0; width: 80px;">Name:</td>
                            <td style="color: #44403c; font-weight: 500;">${helperName}</td>
                        </tr>
                        <tr>
                            <td style="color: #78716c; padding: 5px 0;">Email:</td>
                            <td style="color: #44403c; font-weight: 500;"><a href="mailto:${helperEmail}" style="color: #0d9488;">${helperEmail}</a></td>
                        </tr>
                        ${helperPhone ? `
                        <tr>
                            <td style="color: #78716c; padding: 5px 0;">Phone:</td>
                            <td style="color: #44403c; font-weight: 500;"><a href="tel:${helperPhone}" style="color: #0d9488;">${helperPhone}</a></td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                
                <p style="color: #78716c; font-size: 14px;">
                    You can reply directly to this email to contact ${helperName}.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 30px 0;" />
                
                <p style="color: #a8a29e; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} HelpRadar. Connecting communities.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
