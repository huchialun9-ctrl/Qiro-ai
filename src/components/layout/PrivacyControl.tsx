'use client';

import React, { useState } from 'react';
import { Trash2, ShieldCheck, CloudOff } from 'lucide-react';
import { clear } from 'idb-keyval';
import styles from './PrivacyControl.module.css';

export default function PrivacyControl() {
    const [isClearing, setIsClearing] = useState(false);

    const handleIncinerate = async () => {
        if (!confirm("Are you sure? This will PERMANENTLY delete all your local canvas data.")) return;

        setIsClearing(true);
        try {
            // Clear IndexedDB
            await clear();
            // Clear localStorage just in case
            localStorage.clear();

            // Reload to reset state
            window.location.reload();
        } catch (error) {
            console.error("Failed to incinerate data:", error);
            setIsClearing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.statusIndicator} title="Data stored locally in your browser">
                <div className={styles.statusDot} />
                <ShieldCheck size={14} />
                <span>Local-First Storage</span>
            </div>

            <div style={{ width: 1, height: 16, background: '#e0e0e0' }} />

            <button
                className={styles.incinerateButton}
                onClick={handleIncinerate}
                disabled={isClearing}
            >
                <Trash2 size={12} />
                {isClearing ? 'Incinerating...' : 'Incinerate Data'}
            </button>
        </div>
    );
}
