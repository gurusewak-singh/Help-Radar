'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react';

// Admin emails - users with these emails get admin access
const ADMIN_EMAILS = [
    'admin@helpradar.com',
    'guruop.gsb@gmail.com',
];

interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if email is admin
const checkIsAdmin = (email: string): boolean => {
    return ADMIN_EMAILS.some(adminEmail =>
        adminEmail.toLowerCase() === email.toLowerCase()
    );
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync NextAuth session with local state
    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
            return;
        }

        if (session?.user) {
            // User is logged in via NextAuth (Google)
            const authUser: User = {
                id: session.user.id || '',
                email: session.user.email || '',
                name: session.user.name || '',
                isAdmin: session.user.isAdmin || checkIsAdmin(session.user.email || ''),
            };
            setUser(authUser);
            localStorage.setItem('helpradar_user', JSON.stringify(authUser));
        } else {
            // Check for credentials-based session in localStorage
            const storedUser = localStorage.getItem('helpradar_user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    parsedUser.isAdmin = checkIsAdmin(parsedUser.email);
                    setUser(parsedUser);
                } catch {
                    localStorage.removeItem('helpradar_user');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        }
        setIsLoading(false);
    }, [session, status]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            
            if (data.success && data.user) {
                const authenticatedUser: User = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    isAdmin: checkIsAdmin(data.user.email),
                };
                setUser(authenticatedUser);
                localStorage.setItem('helpradar_user', JSON.stringify(authenticatedUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const loginWithGoogle = async (): Promise<void> => {
        await nextAuthSignIn('google', { callbackUrl: '/requests' });
    };

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            
            if (data.success && data.user) {
                const registeredUser: User = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    isAdmin: checkIsAdmin(data.user.email),
                };
                setUser(registeredUser);
                localStorage.setItem('helpradar_user', JSON.stringify(registeredUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('helpradar_user');
        // Also sign out from NextAuth if there's a session
        if (session) {
            await nextAuthSignOut({ callbackUrl: '/logout' });
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isLoggedIn: !!user,
            isAdmin: user?.isAdmin ?? false,
            login,
            loginWithGoogle,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
