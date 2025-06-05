import { env } from '@/env';
import Anthropic from '@anthropic-ai/sdk';

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

    async getResults() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;

            // if (error instanceof Module1Error) {
            //     throw error;
            // }

            // if (error instanceof Error && error.name === 'AbortError') {
            //     throw new Module1Error('Request timeout', 408);
            // }

            // throw new Module1Error(
            //     error instanceof Error ? error.message : 'Unknown error occurred',
            //     500
            // );
        }
    }
}

// Create and export a default instance
export const anthropicClient = new AnthropicClient({
    apiKey: env.ANTHROPIC_API_KEY as string,
    timeout: 15000,
});

// Export the class for custom instances
export default AnthropicClient;