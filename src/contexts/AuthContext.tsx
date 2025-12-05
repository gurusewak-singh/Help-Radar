'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if email is admin
    const checkIsAdmin = (email: string): boolean => {
        return ADMIN_EMAILS.some(adminEmail =>
            adminEmail.toLowerCase() === email.toLowerCase()
        );
    };

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('helpradar_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Re-check admin status on load
                parsedUser.isAdmin = checkIsAdmin(parsedUser.email);
                setUser(parsedUser);
            } catch {
                localStorage.removeItem('helpradar_user');
            }
        }
        setIsLoading(false);
    }, []);

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
                    name: data.user.name
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
        // Mock login - in production, this would call an API
        if (email && password) {
            const isAdmin = checkIsAdmin(email);
            const mockUser: User = {
                id: 'user_' + Date.now(),
                email,
                name: email.split('@')[0],
                isAdmin
            };
            setUser(mockUser);
            localStorage.setItem('helpradar_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
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
                    name: data.user.name
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
        // Mock registration - in production, this would call an API
        if (email && password && name) {
            const isAdmin = checkIsAdmin(email);
            const mockUser: User = {
                id: 'user_' + Date.now(),
                email,
                name,
                isAdmin
            };
            setUser(mockUser);
            localStorage.setItem('helpradar_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('helpradar_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isLoggedIn: !!user,
            isAdmin: user?.isAdmin ?? false,
            login,
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
