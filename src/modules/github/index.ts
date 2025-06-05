import { env } from '@/env';
import type { GitHubCommitsResponse } from './types/commits';
import axios from 'axios';
import type { GitHubPullRequestsResponse } from './types/pull-requests';

// Configuration interface
interface Module1Config {
    apiKey: string;
    timeout?: number;
}


export class GithubClient {
    private apiKey?: string;
    private timeout: number;

    constructor(config: Module1Config) {
        this.apiKey = config.apiKey;
        this.timeout = config.timeout ?? 10000; // 10 seconds default
    }

    async fetchCommitMessages(
        owner: string,
        repo: string,
        branch: string,
        limit = 10
    ) {
        let url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`;

        // Add branch parameter if specified
        if (branch) {
            url += `&sha=${branch}`;
        }

        try {
            const response = await axios.get<GitHubCommitsResponse>(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-API-Client',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: this.timeout,
            });

            // Extract just the commit messages
            const messages = response.data.map(commit => ({
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                sha: commit.sha.substring(0, 7),
            }));

            return messages;
        } catch (error) {
            console.error('Error fetching commits:', error);
            throw error;
        }
    }

    async getPullRequests(
        owner: string,
        repo: string,
        state: 'open' | 'closed' | 'all' = 'open',
        limit = 10
    ) {
        const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=${limit}&sort=updated&direction=desc`;

        try {
            const response = await axios.get<GitHubPullRequestsResponse>(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-API-Client',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: this.timeout,
            });

            // Return only the essential information
            return response.data.map(pr => ({
                number: pr.number,
                title: pr.title,
                description: pr.body || 'No description provided',
                author: pr.user.login,
                createdAt: pr.created_at,
                url: pr.html_url
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching pull requests:', error.response?.status, error.message);
            }
            throw error;
        }
    }
}

// Create and export a default instance
export const githubClient = new GithubClient({
    apiKey: env.GITHUB_TOKEN,
    timeout: 15000,
});

// Export the class for custom instances
export default GithubClient;