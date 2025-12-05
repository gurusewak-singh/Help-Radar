import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// Admin emails - users with these emails get admin access
const ADMIN_EMAILS = [
    'admin@helpradar.com',
    'guruop.gsb@gmail.com',
];

const checkIsAdmin = (email: string): boolean => {
    return ADMIN_EMAILS.some(adminEmail =>
        adminEmail.toLowerCase() === email.toLowerCase()
    );
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select('+password');
                
                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    isAdmin: checkIsAdmin(user.email),
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // For Google OAuth, create or update user in database
            if (account?.provider === 'google') {
                await dbConnect();
                
                const existingUser = await User.findOne({ email: user.email });
                
                if (!existingUser) {
                    // Create new user for Google sign-in
                    await User.create({
                        email: user.email,
                        name: user.name,
                        googleId: account.providerAccountId,
                        role: checkIsAdmin(user.email!) ? 'admin' : 'user',
                        trustScore: 50,
                    });
                } else {
                    // Update existing user with Google ID if not set
                    if (!existingUser.googleId) {
                        existingUser.googleId = account.providerAccountId;
                        await existingUser.save();
                    }
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = checkIsAdmin(user.email!);
            }
            if (account?.provider === 'google') {
                // For Google users, get or create DB user ID
                await dbConnect();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.isAdmin = token.isAdmin as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
});
