'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/utilities/auth';
import { supabase } from '@/lib/supabaseClient';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { session, setSession, setUser } = useAuthStore();
    const [status, setStatus] = useState('Completing secure sign in...');
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const error_description = searchParams.get('error_description');

            if (error) {
                setStatus(`Error: ${error_description || error}`);
                // Removed auto-redirect
                return;
            }

            if (code) {
                try {
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;

                    if (data.session) {
                        setSession(data.session);
                        setUser(data.session.user);
                        setStatus('Success! Redirecting...');
                        router.push('/canvas');
                    }
                } catch (err: any) {
                    console.error('Auth Callback Error:', err);
                    setStatus(`Sign in failed: ${err.message}`);
                    // Removed auto-redirect to let user see error
                }
            } else {
                // Check if session exists (Implicit or already handled)
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    setSession(data.session);
                    setUser(data.session.user);
                    router.push('/canvas');
                } else {
                    router.push('/login');
                }
            }
        };

        handleCallback();
    }, [searchParams, router, setSession, setUser]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
        }}>
            <p className="animate-pulse">{status}</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
