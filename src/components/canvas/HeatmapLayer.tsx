import React, { useEffect, useState } from 'react';
import styles from './Heatmap.module.css';
import { Sparkles, X, Check } from 'lucide-react';

export interface Hotspot {
    id: string;
    x: number;
    y: number;
    radius: number;
    intensity: number;
    label: string;
}

interface HeatmapLayerProps {
    hotspots: Hotspot[];
    activeSuggestion: { title: string, message: string } | null;
    onAcceptSuggestion: () => void;
    onDismissSuggestion: () => void;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
    hotspots,
    activeSuggestion,
    onAcceptSuggestion,
    onDismissSuggestion
}) => {
    return (
        <>
            <div className={styles.heatmapLayer}>
                {hotspots.map(spot => (
                    <div
                        key={spot.id}
                        className={styles.hotspot}
                        style={{
                            left: spot.x,
                            top: spot.y,
                            width: spot.radius * 2,
                            height: spot.radius * 2,
                            marginLeft: -spot.radius,
                            marginTop: -spot.radius,
                        }}
                    >
                        <div className={styles.hotspotLabel}>{spot.label}</div>
                    </div>
                ))}
            </div>

            {activeSuggestion && (
                <div className={styles.suggestionToast}>
                    <div className={styles.suggestionAvatar}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <div className={styles.suggestionContent}>
                        <div className={styles.suggestionTitle}>{activeSuggestion.title}</div>
                        <div className={styles.suggestionText}>{activeSuggestion.message}</div>
                        <div className={styles.suggestionActions}>
                            <button className={styles.actionButton} onClick={onAcceptSuggestion}>
                                <Check size={14} style={{ marginRight: 4 }} />
                                Expand
                            </button>
                            <button className={styles.actionButton} onClick={onDismissSuggestion}>
                                <X size={14} style={{ marginRight: 4 }} />
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
