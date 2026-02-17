'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Trash2, Undo, Redo, X, Zap } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import styles from './CommandPalette.module.css';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Canvas store actions
    const addNode = useCanvasStore((state: any) => state.addNode);

    // Zundo temporal access
    const temporal = useCanvasStore.temporal?.getState();

    const [filteredActions, setFilteredActions] = useState<any[]>([]);

    useEffect(() => {
        const actions = [
            {
                id: 'add-node',
                label: 'Add New Idea Node',
                icon: <Plus size={18} />,
                shortcut: 'N',
                action: () => {
                    addNode({
                        id: crypto.randomUUID(),
                        content: 'New Idea',
                        x: 0,
                        y: 0,
                        type: 'default'
                    });
                }
            },
            {
                id: 'undo',
                label: 'Undo Last Action',
                icon: <Undo size={18} />,
                shortcut: 'Cmd+Z',
                action: () => temporal?.undo()
            },
            {
                id: 'redo',
                label: 'Redo Action',
                icon: <Redo size={18} />,
                shortcut: 'Cmd+Shift+Z',
                action: () => temporal?.redo()
            },
            {
                id: 'clear',
                label: 'Clear Canvas',
                icon: <Trash2 size={18} />,
                shortcut: 'Cmd+Del',
                action: () => {
                    if (confirm("Clear everything?")) useCanvasStore.setState({ nodes: [], connections: [] });
                }
            },
            // Slash Commands
            {
                id: 'cmd-generate',
                label: '/generate <idea> : Create a new node with AI content',
                icon: <Zap size={18} color="#FFD700" />,
                shortcut: '/gen',
                action: (args?: string) => {
                    // Simple implementation: Create a node with the prompt
                    // In the future, this could trigger an agent immediately
                    addNode({
                        id: crypto.randomUUID(),
                        content: args || 'AI Generated Idea',
                        x: 0,
                        y: 0,
                        type: 'default', // Could be 'executor' to auto-run
                        confidence: 90,
                        model: 'o1-mini (Simulated)',
                        reasoning: 'Generated via Command Palette'
                    });
                }
            },
            {
                id: 'cmd-analyze',
                label: '/analyze : Analyze the current canvas state',
                icon: <Search size={18} color="#A020F0" />,
                shortcut: '/ana',
                action: () => {
                    alert("Analysis started... (Feature coming in Agent Debate)");
                }
            }
        ];

        let filtered = [];
        if (query.startsWith('/')) {
            const cmd = query.slice(1).split(' ')[0].toLowerCase();
            const args = query.split(' ').slice(1).join(' ');

            filtered = actions.filter(a => a.label.startsWith('/') && a.label.includes(cmd));

            // Attach args to the action so it can be used on Enter
            filtered = filtered.map(a => ({
                ...a,
                runArgs: args
            }));

        } else {
            filtered = actions.filter(action =>
                !action.label.startsWith('/') && action.label.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredActions(filtered);

    }, [query, addNode, temporal]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }

            if (isOpen) {
                if (e.key === 'Escape') {
                    setIsOpen(false);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % filteredActions.length);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredActions[selectedIndex]) {
                        // Pass arguments if any
                        const actionItem = filteredActions[selectedIndex];
                        actionItem.action(actionItem.runArgs);
                        setIsOpen(false);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredActions, selectedIndex]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSelectedIndex(0);
            setQuery('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <div className={styles.inputWrapper}>
                    <Search size={20} color="#999" />
                    <input
                        ref={inputRef}
                        className={styles.input}
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className={styles.shortcut}>Esc</div>
                </div>
                <div className={styles.list}>
                    {filteredActions.map((action, index) => (
                        <div
                            key={action.id}
                            className={index === selectedIndex ? styles.itemSelected : styles.item}
                            onClick={() => {
                                action.action();
                                setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className={styles.itemIcon}>
                                {action.icon}
                                <span>{action.label}</span>
                            </div>
                            {action.shortcut && <span className={styles.shortcut}>{action.shortcut}</span>}
                        </div>
                    ))}
                    {filteredActions.length === 0 && (
                        <div className={styles.item} style={{ color: '#999', cursor: 'default' }}>
                            No commands found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
