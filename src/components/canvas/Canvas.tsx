'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { AgentService, AgentPersona } from '@/services/AgentService';
import { HeatmapLayer } from './HeatmapLayer';
import { HandOffPortal, AgentType } from './HandOffPortal';
import PrivacyControl from '../layout/PrivacyControl';
import CommandPalette from '../ui/CommandPalette';
import { Plus, Search, MessageSquare, Briefcase, Play, Info } from 'lucide-react';
import styles from './Canvas.module.css';

interface NodeProps {
    id: string;
    content: string;
    x: number;
    y: number;
    type: string;
    confidence?: number;
    reasoning?: string;
    model?: string;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
    onMouseUp: (e: React.MouseEvent, id: string) => void;
    onActivate?: (id: string, type: string) => void;
}

const NodeComponent = ({ id, content, x, y, type, confidence, reasoning, model, onMouseDown, onMouseUp, onActivate }: NodeProps) => {
    const isAgent = type === 'explorer' || type === 'critic' || type === 'executor';

    // Determine confidence color
    let confidenceClass = styles.confidenceHigh;
    if (confidence !== undefined) {
        if (confidence < 50) confidenceClass = styles.confidenceLow;
        else if (confidence < 80) confidenceClass = styles.confidenceMed;
    }

    return (
        <div
            className={`${styles.node} ${isAgent ? styles.agentNode : ''}`}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            onMouseDown={(e) => onMouseDown(e, id)}
            onMouseUp={(e) => onMouseUp(e, id)}
        >
            <div className={styles.nodeHeader}>
                <span>{type}</span>
                {isAgent && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onActivate?.(id, type); }}
                        className="ml-2 hover:text-white"
                        title="Run Agent"
                    >
                        <Play size={12} />
                    </button>
                )}
            </div>
            <div className={styles.nodeContent}>
                {content}
            </div>

            {(confidence !== undefined || model) && (
                <div className={styles.nodeFooter}>
                    {confidence !== undefined && (
                        <div className={styles.infoContainer}>
                            <span className={`${styles.confidenceBadge} ${confidenceClass}`}>
                                {confidence}% {confidence < 50 ? 'Check' : ''}
                            </span>
                            {reasoning && (
                                <div className={styles.tooltip}>
                                    <strong>Why?</strong> {reasoning}
                                </div>
                            )}
                        </div>
                    )}
                    {model && <span className={styles.modelLabel}>{model}</span>}
                    {reasoning && <Info size={12} className={styles.infoIcon} />}
                </div>
            )}
        </div>
    );
};

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { nodes, connections, zoom, pan, setPan, setZoom, addNode, updateNodePosition, addConnection } = useCanvasStore();
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

    // Connection state
    const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
    const [tempConnectionEnd, setTempConnectionEnd] = useState<{ x: number, y: number } | null>(null);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    // Ripple state
    const [ripples, setRipples] = useState<{ id: string, x: number, y: number }[]>([]);

    const addRipple = (x: number, y: number) => {
        const id = crypto.randomUUID();
        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1500);
    };

    // Heatmap state
    const [hotspots, setHotspots] = useState<{ id: string, x: number, y: number, radius: number, intensity: number, label: string }[]>([
        { id: 'h1', x: 200, y: -200, radius: 150, intensity: 0.8, label: 'Cross-Domain Opportunity' },
        { id: 'h2', x: -400, y: 300, radius: 120, intensity: 0.6, label: 'Untapped Niche' },
    ]);
    const [activeSuggestion, setActiveSuggestion] = useState<{ title: string, message: string } | null>(null);

    const checkHotspotIntersection = (nodeId: string, x: number, y: number) => {
        const node = nodes.find(n => n.id === nodeId);
        const nodeCx = x + 100;
        const nodeCy = y + 50;

        const hit = hotspots.find(h => {
            const dx = nodeCx - h.x;
            const dy = nodeCy - h.y;
            return Math.sqrt(dx * dx + dy * dy) < h.radius;
        });

        if (hit) {
            setActiveSuggestion({
                title: "Insight Unlocked!",
                message: `I noticed you're exploring "${hit.label}". Shall I generate 3 related concepts to bridge the gap?`
            });
        }
    };

    const handleAcceptSuggestion = () => {
        const centerNode = nodes[nodes.length - 1];
        const baseX = centerNode ? centerNode.x : 0;
        const baseY = centerNode ? centerNode.y : 0;

        for (let i = 0; i < 3; i++) {
            addNode({
                id: crypto.randomUUID(),
                content: `AI Concept ${i + 1}`,
                x: baseX + (Math.random() * 300 - 150),
                y: baseY + 200 + (Math.random() * 100),
                type: 'default'
            });
        }
        setActiveSuggestion(null);
    };

    const handlePortalDrop = async (agentType: AgentType) => {
        if (!draggedNodeId) return;
        const node = nodes.find(n => n.id === draggedNodeId);
        if (!node) return;

        let prompt = '';
        let prefix = '';
        if (agentType === 'post-it') {
            prompt = `Generate 5 engaging social media posts based on: "${node.content}".`;
            prefix = 'Post-it Agent';
        } else if (agentType === 'research') {
            prompt = `Identify 3 key patents or research papers related to: "${node.content}".`;
            prefix = 'Research Agent';
        } else if (agentType === 'coder') {
            prompt = `Generate a React component for: "${node.content}".`;
            prefix = 'Coder Agent';
        }

        const response: any = await AgentService.invokeAgent('executor', [node], prompt); // Re-using executor for now

        // Handle both legacy string (error) and new object
        const content = typeof response === 'string' ? response : (response?.content || 'No response');
        const confidence = typeof response === 'object' ? response?.confidence : undefined;
        const reasoning = typeof response === 'object' ? response?.reasoning : undefined;
        const model = typeof response === 'object' ? response?.model : undefined;

        const resultId = crypto.randomUUID();
        addNode({
            id: resultId,
            content: `[${prefix}]\n${content}`,
            x: node.x + 300,
            y: node.y,
            type: 'default',
            confidence,
            reasoning,
            model
        });

        addConnection({
            id: crypto.randomUUID(),
            sourceId: node.id,
            targetId: resultId,
            label: 'Hand-off'
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains(styles.gridBackground)) {
            setIsDraggingCanvas(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });

            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const worldX = (e.clientX - rect.left - pan.x) / zoom;
                const worldY = (e.clientY - rect.top - pan.y) / zoom;
                addRipple(worldX, worldY);
            }
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        if (e.shiftKey) {
            setConnectingNodeId(id);
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const worldX = (e.clientX - rect.left - pan.x) / zoom;
                const worldY = (e.clientY - rect.top - pan.y) / zoom;
                setTempConnectionEnd({ x: worldX, y: worldY });
            }
        } else {
            setDraggedNodeId(id);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleNodeMouseUp = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        if (connectingNodeId && connectingNodeId !== id) {
            addConnection({
                id: crypto.randomUUID(),
                sourceId: connectingNodeId,
                targetId: id,
                label: 'Flow'
            });
            setConnectingNodeId(null);
            setTempConnectionEnd(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;

        if (connectingNodeId) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const worldX = (e.clientX - rect.left - pan.x) / zoom;
                const worldY = (e.clientY - rect.top - pan.y) / zoom;
                setTempConnectionEnd({ x: worldX, y: worldY });
            }
        } else if (draggedNodeId) {
            const node = nodes.find(n => n.id === draggedNodeId);
            if (node) {
                updateNodePosition(
                    draggedNodeId,
                    node.x + dx / zoom,
                    node.y + dy / zoom
                );
            }
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (isDraggingCanvas) {
            setPan(pan.x + dx, pan.y + dy);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        if (draggedNodeId) {
            const node = nodes.find(n => n.id === draggedNodeId);
            if (node) {
                checkHotspotIntersection(draggedNodeId, node.x, node.y);
            }
        }

        setIsDraggingCanvas(false);
        setDraggedNodeId(null);
        setConnectingNodeId(null);
        setTempConnectionEnd(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        const zoomFactor = 0.001;
        const newZoom = Math.max(0.1, Math.min(5, zoom - e.deltaY * zoomFactor));
        setZoom(newZoom);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const worldX = (clientX - pan.x) / zoom;
        const worldY = (clientY - pan.y) / zoom;

        addNode({
            id: crypto.randomUUID(),
            content: 'New Idea Node',
            x: worldX,
            y: worldY,
            type: 'default'
        });
    };

    // Helper to get node center
    const getNodeCenter = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        return { x: node.x + 100, y: node.y + 50 };
    };

    const handleAddNode = (type: string, label: string) => {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        const worldX = (screenCenterX - pan.x) / zoom;
        const worldY = (screenCenterY - pan.y) / zoom;

        addNode({
            id: crypto.randomUUID(),
            content: type === 'default' ? 'New Idea' : `${label} Agent`,
            x: worldX + (Math.random() * 50 - 25),
            y: worldY + (Math.random() * 50 - 25),
            type: type
        });
    };

    const handleActivateAgent = async (id: string, type: string) => {
        const connectedIds = connections
            .filter(c => c.sourceId === id || c.targetId === id)
            .map(c => c.sourceId === id ? c.targetId : c.sourceId);

        const connectedNodes = nodes.filter(n => connectedIds.includes(n.id));

        if (connectedNodes.length === 0) {
            alert("Connect this agent to some nodes first!");
            return;
        }

        const agentNode = nodes.find(n => n.id === id);
        if (!agentNode) return;

        const response: any = await AgentService.invokeAgent(type as AgentPersona, connectedNodes);

        const content = typeof response === 'string' ? response : (response?.content || 'No response');
        const confidence = typeof response === 'object' ? response?.confidence : undefined;
        const reasoning = typeof response === 'object' ? response?.reasoning : undefined;
        const model = typeof response === 'object' ? response?.model : undefined;

        const resultId = crypto.randomUUID();
        addNode({
            id: resultId,
            content: content,
            x: agentNode.x + 250,
            y: agentNode.y,
            type: 'default',
            confidence,
            reasoning,
            model
        });

        addConnection({
            id: crypto.randomUUID(),
            sourceId: id,
            targetId: resultId,
            label: 'Result'
        });
    };

    return (
        <div
            ref={containerRef}
            className={styles.canvasContainer}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
        >
            <div
                className={styles.canvasLayer}
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                }}
            >
                <div className={styles.gridBackground} />

                <HeatmapLayer
                    hotspots={hotspots}
                    activeSuggestion={null}
                    onAcceptSuggestion={() => { }}
                    onDismissSuggestion={() => { }}
                />

                {ripples.map(ripple => (
                    <div
                        key={ripple.id}
                        className={styles.ripple}
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 100,
                            height: 100,
                            marginLeft: -50,
                            marginTop: -50
                        }}
                    />
                ))}

                <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                    {connections.map(conn => {
                        const source = getNodeCenter(conn.sourceId);
                        const target = getNodeCenter(conn.targetId);
                        return (
                            <line
                                key={conn.id}
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                className={styles.connectionLine}
                            />
                        );
                    })}
                    {connectingNodeId && tempConnectionEnd && (
                        <line
                            x1={getNodeCenter(connectingNodeId).x}
                            y1={getNodeCenter(connectingNodeId).y}
                            x2={tempConnectionEnd.x}
                            y2={tempConnectionEnd.y}
                            className={styles.connectionLine}
                            style={{ strokeDasharray: '5,5' }}
                        />
                    )}
                </svg>

                {nodes.map(node => (
                    <NodeComponent
                        key={node.id}
                        {...node}
                        onMouseDown={handleNodeMouseDown}
                        onMouseUp={handleNodeMouseUp}
                        onActivate={handleActivateAgent}
                    />
                ))}
            </div>

            <HandOffPortal
                onDrop={handlePortalDrop}
                isDraggingNode={!!draggedNodeId}
            />

            {/* Render Suggestion Toast outside scalable layer */}
            {activeSuggestion && (
                <HeatmapLayer
                    hotspots={[]} // Don't render hotspots again
                    activeSuggestion={activeSuggestion}
                    onAcceptSuggestion={handleAcceptSuggestion}
                    onDismissSuggestion={() => setActiveSuggestion(null)}
                />
            )}

            <div className={styles.toolbar}>
                <button className={styles.toolbarButton} onClick={() => handleAddNode('default', 'Idea')}>
                    <Plus size={20} />
                    Idea
                </button>
                <button className={styles.toolbarButton} onClick={() => handleAddNode('explorer', 'Explorer')}>
                    <Search size={20} />
                    Explorer
                </button>
                <button className={styles.toolbarButton} onClick={() => handleAddNode('critic', 'Critic')}>
                    <MessageSquare size={20} />
                    Critic
                </button>
                <button className={styles.toolbarButton} onClick={() => handleAddNode('executor', 'Executor')}>
                    <Briefcase size={20} />
                    Executor
                </button>
            </div>

            <PrivacyControl />
            <CommandPalette />
        </div>
    );
}
