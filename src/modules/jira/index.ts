import axios from 'axios';
import type { JiraIssue, JiraResponse } from './types/issue';

// Configuration interface
interface JiraConfig {
    domain: string;
    email: string;
    apiKey: string;
    timeout?: number;
}


export class JiraClient {
    private baseUrl: string;
    private auth: string;

    constructor(config: JiraConfig) {
        this.baseUrl = `https://${config.domain}.atlassian.net/rest/api/2`;
        this.auth = Buffer.from(`${config.email}:${config.apiKey}`).toString('base64');
    }

    async getProjectIssues(projectKey: string): Promise<JiraIssue[]> {
        try {
            const response = await axios.get<JiraResponse>(
                `${this.baseUrl}/search`,
                {
                    headers: {
                        'Authorization': `Basic ${this.auth}`,
                        'Accept': 'application/json',
                    },
                    params: {
                        jql: `project = ${projectKey}`,
                        fields: 'summary,status,assignee,created',
                        maxResults: 100
                    }
                }
            );

            return response.data.issues;
        } catch (error) {
            console.error('Error fetching Jira issues:', error);
            throw error;
        }
    }

}


// Export the class for custom instances
export default JiraClient;