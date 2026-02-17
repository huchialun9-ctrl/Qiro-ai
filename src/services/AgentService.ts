import OpenAI from 'openai';

const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';

const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: githubToken,
    dangerouslyAllowBrowser: true // Client-side usage for demo
});

export type AgentPersona = 'explorer' | 'critic' | 'executor';

const SYSTEM_PROMPTS = {
    explorer: `You are the EXPLORER. Your goal is to find interesting, non-obvious connections between concepts on the canvas. 
             When given a set of nodes, suggest 3 new nodes that bridge gaps or expand the horizon. 
             Focus on novelty and "what if" scenarios. 
             RETURN JSON ONLY: { 
               "content": "Brief summary of suggestions", 
               "confidence": <0-100>, 
               "reasoning": "Why these connections matter",
               "suggestions": [{ "content": "...", "reason": "..." }] 
             }`,

    critic: `You are the CRITIC. Your goal is to find holes, logical fallacies, or missing constraints in the current plan.
           Review the connected nodes and point out 3 potential risks or contradictions.
           Be sharp but constructive.
           RETURN JSON ONLY: { 
             "content": "Summary of critique", 
             "confidence": <0-100>, 
             "reasoning": "Basis of the critique",
             "critiques": [{ "point": "...", "severity": "high|medium|low" }] 
           }`,

    executor: `You are the EXECUTOR. Your goal is to turn the abstract nodes into concrete tasks.
             Convert the visible nodes into a structured action plan or user stories.
             RETURN JSON ONLY: { 
               "content": "Markdown formatted action plan...", 
               "confidence": <0-100>, 
               "reasoning": "Why this plan is feasible" 
             }`,
};

export class AgentService {
    static async invokeAgent(persona: AgentPersona, contextNodes: any[], userQuery?: string) {
        const contextString = JSON.stringify(contextNodes.map((n: any) => ({ type: n.type, content: n.content })));
        const prompt = `Context: ${contextString}\n\nUser Query: ${userQuery || 'Analyze this.'}`;

        try {
            if (!githubToken) {
                return JSON.stringify({ content: "Error: NEXT_PUBLIC_GITHUB_TOKEN not configured." });
            }

            const response = await client.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPTS[persona] },
                    { role: 'user', content: prompt }
                ],
                model: 'gpt-4o',
                temperature: 1,
                max_tokens: 4096,
                top_p: 1,
                response_format: { type: "json_object" }
            });

            const rawContent = response.choices[0].message.content;
            if (!rawContent) return null;

            try {
                const parsed = JSON.parse(rawContent);
                return { ...parsed, model: 'gpt-4o' }; // Attach model info
            } catch (e) {
                console.error("Failed to parse AI JSON", e);
                return { content: rawContent, model: 'gpt-4o', confidence: 0 };
            }

        } catch (error) {
            console.error("Agent interaction failed:", error);
            return { content: "Error: Agent interaction failed.", confidence: 0 };
        }
    }
}
