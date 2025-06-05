import { env } from '@/env';
import Anthropic from '@anthropic-ai/sdk';
import type { ProgressReport } from './types/analyze';

interface ApiResult {
    id: string;
    name: string;
    value: number;
    status: string;
}

interface GetResultsResponse {
    results: ApiResult[];
    total: number;
    page: number;
}

// Configuration interface
interface Module1Config {
    apiKey: string;
    timeout?: number;
}

// Custom error class
// export class Module1Error extends Error {
//     constructor(
//         message: string,
//         public status: number,
//         public code?: string
//     ) {
//         super(message);
//         this.name = 'Module1Error';
//     }
// }

export class AnthropicClient {
    private apiKey?: string;
    private timeout: number;

    constructor(config: Module1Config) {
        this.apiKey = config.apiKey;
        this.timeout = config.timeout ?? 10000; // 10 seconds default
    }

    async test() {
        const anthropic = new Anthropic({
            apiKey: this.apiKey,
        });

        const msg = await anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1024,
            messages: [{ role: "user", content: "Hello, Claude" }],
        });

        return msg;
    }

    async analyzeGithub(
        systemPrompt: string,
        userPrompt: string,
    ) {
        const anthropic = new Anthropic({
            apiKey: this.apiKey,
        });

        try {
            const response = await anthropic.messages.create({
                model: "claude-3-7-sonnet-latest",
                max_tokens: 1024,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt },
                ],
            });

            const textBlock = response.content.find(block => block.type === 'text');
            if (!textBlock || textBlock.type !== 'text') {
                throw new Error('No text content found in response');
            }

            const analysisText = textBlock.text;
            const cleanedText = analysisText.replace(/^```json?\s*|\s*```$/gi, '').trim();
            const analysis = JSON.parse(cleanedText) as ProgressReport;

            return analysis;
        } catch (error) {
            console.error('Error analyzing GitHub data:', error);
            throw new Error(`Failed to analyze GitHub data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Create and export a default instance
export const anthropicClient = new AnthropicClient({
    apiKey: env.ANTHROPIC_API_KEY,
    timeout: 15000,
});

// Export the class for custom instances
export default AnthropicClient;