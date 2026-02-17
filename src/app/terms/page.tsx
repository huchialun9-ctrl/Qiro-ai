'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="terms-container">
            <div className="terms-header">
                <Link href="/signup" className="back-link">
                    <ArrowLeft size={16} /> Back to Sign Up
                </Link>
                <h1>Qiroai - User Agreement & Privacy Policy</h1>
                <p className="effective-date">Effective Date: February 17, 2026</p>
            </div>

            <div className="terms-content">
                <section>
                    <h2>1. Introduction</h2>
                    <p>Welcome to Qiroai ("we," "our," or "us"). By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
                </section>

                <section>
                    <h2>2. Use of Service</h2>
                    <p>Qiroai provides an AI-powered collaboration canvas. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
                    <ul>
                        <li>You must be at least 13 years old to use the service.</li>
                        <li>You are responsible for maintaining the security of your account.</li>
                        <li>You agree not to misuse the AI generation features for harmful content.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. User Content</h2>
                    <p>You retain ownership of any content you create on Qiroai. By using the service, you grant us a license to host, store, and display your content solely for the purpose of providing the service.</p>
                </section>

                <section>
                    <h2>4. Privacy Policy</h2>
                    <p>We respect your privacy. We collect only the data necessary to provide and improve our services.</p>
                    <h3>4.1 Data We Collect</h3>
                    <p>Account information (email), canvas data (nodes, connections), and usage metrics.</p>
                    <h3>4.2 How We Use Data</h3>
                    <p>to authenticate users, sync canvas state, and generate AI responses via third-party providers (e.g., OpenAI).</p>
                </section>

                <section>
                    <h2>5. Disclaimer</h2>
                    <p>The service is provided "as is" without warranties of any kind. We utilize generative AI which may produce inaccurate information.</p>
                </section>
            </div>

            <style jsx global>{`
        .terms-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .terms-header {
            margin-bottom: 40px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 20px;
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #666;
            text-decoration: none;
            margin-bottom: 16px;
            font-size: 0.9rem;
        }
        .back-link:hover { color: #1a1a1a; }
        .effective-date { color: #666; font-size: 0.9rem; }
        h1 { font-size: 2rem; margin-bottom: 8px; }
        h2 { font-size: 1.5rem; margin-top: 32px; margin-bottom: 16px; color: #1a1a1a; }
        h3 { font-size: 1.2rem; margin-top: 24px; margin-bottom: 12px; color: #4a4a4a; }
        p { margin-bottom: 16px; }
        ul { margin-bottom: 16px; padding-left: 20px; }
        li { margin-bottom: 8px; }
      `}</style>
        </div>
    );
}
