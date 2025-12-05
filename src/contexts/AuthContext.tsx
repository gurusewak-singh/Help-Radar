'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('helpradar_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('helpradar_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock login - in production, this would call an API
        if (email && password) {
            const mockUser: User = {
                id: 'user_' + Date.now(),
                email,
                name: email.split('@')[0]
            };
            setUser(mockUser);
            localStorage.setItem('helpradar_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        // Mock registration - in production, this would call an API
        if (email && password && name) {
            const mockUser: User = {
                id: 'user_' + Date.now(),
                email,
                name
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
