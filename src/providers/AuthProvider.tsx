'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/utilities/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setSession, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        // Initial session check
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [setSession, setUser, setLoading]);

    return <>{children}</>;
}
