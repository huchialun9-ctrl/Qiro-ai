import React, { useState } from 'react';
import { FileText, Search, Code } from 'lucide-react';
import styles from './HandOffPortal.module.css';

export type AgentType = 'post-it' | 'research' | 'coder';

interface HandOffPortalProps {
    onDrop: (agentType: AgentType) => void;
    isDraggingNode: boolean;
}

export const HandOffPortal: React.FC<HandOffPortalProps> = ({ onDrop, isDraggingNode }) => {
    const [activePortal, setActivePortal] = useState<AgentType | null>(null);

    const handleMouseEnter = (type: AgentType) => {
        if (isDraggingNode) {
            setActivePortal(type);
        }
    };

    const handleMouseLeave = () => {
        setActivePortal(null);
    };

    const handleMouseUp = (type: AgentType) => {
        if (isDraggingNode) {
            onDrop(type);
            setActivePortal(null);
        }
    };

    return (
        <div className={styles.portalContainer}>
            <div
                className={`${styles.portal} ${activePortal === 'post-it' ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter('post-it')}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp('post-it')}
            >
                <FileText className={styles.portalIcon} />
                <div className={styles.portalLabel}>Post-it Agent</div>
            </div>

            <div
                className={`${styles.portal} ${activePortal === 'research' ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter('research')}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp('research')}
            >
                <Search className={styles.portalIcon} />
                <div className={styles.portalLabel}>Research Agent</div>
            </div>

            <div
                className={`${styles.portal} ${activePortal === 'coder' ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter('coder')}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp('coder')}
            >
                <Code className={styles.portalIcon} />
                <div className={styles.portalLabel}>Coder Agent</div>
            </div>
        </div>
    );
};
