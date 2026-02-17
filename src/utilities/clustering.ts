
interface Node {
    id: string;
    content: string;
    x: number;
    y: number;
    type: string;
}

// Simple Jaccard Similarity (Word Overlap)
function getSimilarity(text1: string, text2: string) {
    const set1 = new Set(text1.toLowerCase().split(/\s+/));
    const set2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

export function performClustering(nodes: Node[]) {
    const threshold = 0.1; // Low threshold for demo
    const clusters: Node[][] = [];
    const visited = new Set<string>();

    for (let i = 0; i < nodes.length; i++) {
        if (visited.has(nodes[i].id)) continue;

        const cluster = [nodes[i]];
        visited.add(nodes[i].id);

        for (let j = i + 1; j < nodes.length; j++) {
            if (visited.has(nodes[j].id)) continue;

            const sim = getSimilarity(nodes[i].content, nodes[j].content);
            if (sim > threshold) {
                cluster.push(nodes[j]);
                visited.add(nodes[j].id);
            }
        }
        clusters.push(cluster);
    }

    return clusters;
}

export function applyClusterLayout(nodes: Node[], clusters: Node[][]) {
    // Reposition nodes based on clusters
    // We will arrange clusters in a grid, and nodes within clusters in a circle
    const newNodes = [...nodes];
    const clusterSpacing = 400;

    clusters.forEach((cluster, colIndex) => {
        const centerX = (colIndex % 3) * clusterSpacing;
        const centerY = Math.floor(colIndex / 3) * clusterSpacing;

        cluster.forEach((node, nodeIndex) => {
            const angle = (nodeIndex / cluster.length) * 2 * Math.PI;
            const radius = 100;
            const targetNode = newNodes.find(n => n.id === node.id);
            if (targetNode) {
                targetNode.x = centerX + Math.cos(angle) * radius;
                targetNode.y = centerY + Math.sin(angle) * radius;
            }
        });
    });

    return newNodes;
}
