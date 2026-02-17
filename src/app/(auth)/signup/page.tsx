'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            setError("You must agree to the Terms of Service.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            // Check if email confirmation is required (Supabase default usually requires it)
            // But for simple DX we might auto-login or show message
            // Assuming default flow:
            alert("Check your email for the confirmation link!");
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Qiroai and start creating</p>

            <form onSubmit={handleSignUp} className="auth-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        required
                        className="form-input"
                        placeholder="Create a password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="terms-checkbox">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        I agree to the <Link href="/terms" className="auth-link">Terms of Service</Link> and <Link href="/terms" className="auth-link">Privacy Policy</Link>.
                    </label>
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="auth-footer">
                Already have an account?
                <Link href="/login" className="auth-link">Sign in</Link>
            </div>
        </>
    );
}
