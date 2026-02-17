'use client';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
            <div className="auth-card">
                {children}
            </div>
            <style jsx global>{`
            .auth-container {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f8f9fa;
                position: relative;
                overflow: hidden;
            }
            .auth-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
            }
            .blob {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                opacity: 0.6;
            }
            .blob-1 {
                top: -10%;
                left: -10%;
                width: 50vw;
                height: 50vw;
                background: #e0f2fe; /* Light Blue */
                animation: float 20s infinite alternate;
            }
            .blob-2 {
                bottom: -10%;
                right: -10%;
                width: 50vw;
                height: 50vw;
                background: #fdf2f8; /* Light Pink */
                animation: float 25s infinite alternate-reverse;
            }
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                100% { transform: translate(50px, 50px) rotate(10deg); }
            }
            .auth-card {
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(20px);
                padding: 40px;
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
                width: 100%;
                max-width: 420px;
                z-index: 1;
                border: 1px solid rgba(255, 255, 255, 0.5);
            }
            .auth-title {
                font-size: 2rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 8px;
                text-align: center;
                letter-spacing: -0.02em;
            }
            .auth-subtitle {
                font-size: 0.95rem;
                color: #666;
                text-align: center;
                margin-bottom: 32px;
            }
            .auth-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .form-label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #4a4a4a;
            }
            .form-input {
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid #e0e0e0;
                font-size: 1rem;
                transition: all 0.2s;
                background: white;
            }
            .form-input:focus {
                outline: none;
                border-color: #4262ff;
                box-shadow: 0 0 0 3px rgba(66, 98, 255, 0.1);
            }
            .auth-button {
                background: #1a1a1a;
                color: white;
                padding: 14px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                border: none;
                cursor: pointer;
                transition: transform 0.1s, opacity 0.2s;
                margin-top: 10px;
            }
            .auth-button:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            .auth-button:active {
                transform: translateY(0);
            }
            .auth-footer {
                margin-top: 24px;
                text-align: center;
                font-size: 0.9rem;
                color: #666;
            }
            .auth-link {
                color: #4262ff;
                font-weight: 600;
                text-decoration: none;
                margin-left: 4px;
            }
            .auth-link:hover {
                text-decoration: underline;
            }
            .error-message {
                color: #ef4444;
                font-size: 0.85rem;
                text-align: center;
                background: #fef2f2;
                padding: 8px;
                border-radius: 8px;
                border: 1px solid #fecaca;
            }
            .terms-checkbox {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                font-size: 0.85rem;
                color: #666;
                margin-top: 8px;
            }
            .terms-checkbox input {
                margin-top: 3px;
            }
        `}</style>
        </div>
    );
}
