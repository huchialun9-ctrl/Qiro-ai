'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/utilities/auth';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { session } = useAuthStore();

    useEffect(() => {
        if (session) {
            router.push('/canvas');
        }
    }, [session, router]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)'
        }}>
            <p>Completing secure sign in...</p>
        </div>
    );
}
