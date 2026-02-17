import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useCanvasStore, PromptNode, PromptConnection } from '@/store/useCanvasStore';

export function useCanvasData() {
    const { setNodes, setConnections } = useCanvasStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const { data: nodesData, error: nodesError } = await supabase
                .from('nodes')
                .select('*');

            const { data: connectionsData, error: connectionsError } = await supabase
                .from('connections')
                .select('*');

            if (nodesError) console.error('Error fetching nodes:', nodesError);
            if (connectionsError) console.error('Error fetching connections:', connectionsError);

            if (nodesData) setNodes(nodesData as PromptNode[]);
            if (connectionsData) setConnections(connectionsData as PromptConnection[]);

            setLoading(false);
        }

        fetchData();

        // Realtime subscription
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'nodes' },
                (payload) => {
                    console.log('Realtime node change:', payload);
                    fetchData(); // Simplistic approach: refetch on change
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'connections' },
                (payload) => {
                    console.log('Realtime connection change:', payload);
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [setNodes, setConnections]);

    return { loading };
}
