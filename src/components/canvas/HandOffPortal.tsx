import React, { useState } from 'react';
import { Github, Layout, Code } from 'lucide-react';
import styles from './HandOffPortal.module.css';

export type AgentType = 'github' | 'figma' | 'coder';

interface HandOffPortalProps {
    onDrop: (agentType: AgentType) => void;
    isDraggingNode: boolean;
}

export const HandOffPortal: React.FC<HandOffPortalProps> = ({ onDrop, isDraggingNode }) => {
    const activeClass = (type: AgentType) => activePortal === type ? styles.active : '';

    const [activePortal, setActivePortal] = useState<AgentType | null>(null);

    const handleMouseEnter = (type: AgentType) => {
        if (isDraggingNode) setActivePortal(type);
    };

    const handleMouseLeave = () => setActivePortal(null);

    const handleMouseUp = (type: AgentType) => {
        if (isDraggingNode) {
            onDrop(type);
            setActivePortal(null);
        }
    };

    return (
        <div className={styles.portalContainer}>
            <div
                className={`${styles.portal} ${activeClass('github')}`}
                onMouseEnter={() => handleMouseEnter('github')}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp('github')}
            >
                <Github className={styles.portalIcon} />
                <div className={styles.portalLabel}>GitHub Issue</div>
            </div>

            <div
                className={`${styles.portal} ${activeClass('figma')}`}
                onMouseEnter={() => handleMouseEnter('figma')}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp('figma')}
            >
                <Layout className={styles.portalIcon} />
                <div className={styles.portalLabel}>Figma Spec</div>
            </div>

            <div
                className={`${styles.portal} ${activeClass('coder')}`}
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
