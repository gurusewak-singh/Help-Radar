'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ToastContainer from './ToastContainer';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <NotificationProvider>
                    {children}
                    <ToastContainer />
                </NotificationProvider>
            </AuthProvider>
        </SessionProvider>
    );
}
