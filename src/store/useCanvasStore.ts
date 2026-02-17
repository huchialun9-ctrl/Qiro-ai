import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { get, set, del } from 'idb-keyval';

export interface PromptNode {
    id: string;
    content: string;
    x: number;
    y: number;
    type: string;
    // AI Transparency
    confidence?: number; // 0-100
    reasoning?: string;
    model?: string;
}

export interface PromptConnection {
    id: string;
    sourceId: string;
    targetId: string;
    label?: string;
}

interface CanvasState {
    nodes: PromptNode[];
    connections: PromptConnection[];
    zoom: number;
    pan: { x: number; y: number };

    addNode: (node: PromptNode) => void;
    updateNodePosition: (id: string, x: number, y: number) => void;
    addConnection: (connection: PromptConnection) => void;
    setZoom: (zoom: number) => void;
    setPan: (x: number, y: number) => void;
    setNodes: (nodes: PromptNode[]) => void;
    setConnections: (connections: PromptConnection[]) => void;
}

// IndexedDB Storage Adapter
const idbStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const value = await get(name);
        return value || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

export const useCanvasStore = create<CanvasState>()(
    temporal(
        persist(
            (set) => ({
                nodes: [],
                connections: [],
                zoom: 1,
                pan: { x: 0, y: 0 },

                addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

                updateNodePosition: (id, x, y) =>
                    set((state) => ({
                        nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
                    })),

                addConnection: (connection) =>
                    set((state) => ({ connections: [...state.connections, connection] })),

                setZoom: (zoom) => set({ zoom }),
                setPan: (x, y) => set({ pan: { x, y } }),

                setNodes: (nodes) => set({ nodes }),
                setConnections: (connections) => set({ connections })
            }),
            {
                name: 'qiroai-canvas-storage',
                storage: createJSONStorage(() => idbStorage),
                partialize: (state) => ({
                    nodes: state.nodes,
                    connections: state.connections,
                    pan: state.pan,
                    zoom: state.zoom
                }),
            }
        ),
        {
            limit: 50,
            partialize: (state) => ({
                nodes: state.nodes,
                connections: state.connections
            }),
        }
    )
);
