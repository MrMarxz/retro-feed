import axios from 'axios';
import type { JiraHistoryItem, JiraIssue, JiraResponse, JiraSearchResponse, TimelineEvent } from './types/issue';

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

    async getProjectTimeline(
        projectKey: string,
        options: {
            maxResults?: number;
            daysBack?: number;
            includeSubtasks?: boolean;
        } = {}
    ): Promise<TimelineEvent[]> {
        const {
            maxResults = 100,
            daysBack = 30,
            includeSubtasks = true
        } = options;

        try {
            // Build JQL query
            const dateFilter = daysBack > 0
                ? ` AND updated >= -${daysBack}d`
                : '';

            const subtaskFilter = includeSubtasks
                ? ''
                : ' AND issuetype != Sub-task';

            const jql = `project = ${projectKey}${dateFilter}${subtaskFilter} ORDER BY updated DESC`;

            const response = await axios.get<JiraSearchResponse>(
                `${this.baseUrl}/search`,
                {
                    headers: {
                        'Authorization': `Basic ${this.auth}`,
                        'Accept': 'application/json',
                    },
                    params: {
                        jql,
                        fields: 'summary,status,created,updated,assignee,reporter',
                        expand: 'changelog',
                        maxResults
                    }
                }
            );

            return this.processTimelineEvents(response.data.issues);
        } catch (error) {
            console.error('Error fetching project timeline:', error);
            throw error;
        }
    }

    private processTimelineEvents(issues: JiraIssue[]): TimelineEvent[] {
        const events: TimelineEvent[] = [];

        for (const issue of issues) {
            // Add creation event
            events.push({
                issueKey: issue.key,
                issueSummary: issue.fields.summary,
                eventType: 'created',
                timestamp: issue.fields.created,
                author: issue.fields.reporter.displayName,
                description: `Issue created: ${issue.fields.summary}`
            });

            // Process changelog entries
            if (issue.changelog?.histories) {
                for (const history of issue.changelog.histories) {
                    for (const item of history.items) {
                        const event: TimelineEvent = {
                            issueKey: issue.key,
                            issueSummary: issue.fields.summary,
                            eventType: this.getEventType(item.field),
                            timestamp: history.created,
                            author: history.author.displayName,
                            description: this.getEventDescription(item),
                            details: {
                                field: item.field,
                                from: item.fromString,
                                to: item.toString
                            }
                        };
                        events.push(event);
                    }
                }
            }
        }

        // Sort by timestamp (newest first)
        return events.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    private getEventType(field: string): TimelineEvent['eventType'] {
        switch (field.toLowerCase()) {
            case 'status':
                return 'status_change';
            case 'assignee':
                return 'assignment_change';
            default:
                return 'other';
        }
    }

    private getEventDescription(item: JiraHistoryItem): string {
        const fieldName = item.field.charAt(0).toUpperCase() + item.field.slice(1);

        if (item.fromString && item.toString) {
            return `${fieldName} changed from "${item.fromString}" to "${item.toString}"`;
        } else if (item.toString) {
            return `${fieldName} set to "${item.toString}"`;
        } else if (item.fromString) {
            return `${fieldName} removed (was "${item.fromString}")`;
        } else {
            return `${fieldName} updated`;
        }
    }

    // Get activity for a specific date range
    async getProjectActivityByDateRange(
        projectKey: string,
        startDate: string, // YYYY-MM-DD format
        endDate: string    // YYYY-MM-DD format
    ): Promise<TimelineEvent[]> {
        try {
            const jql = `project = ${projectKey} AND updated >= "${startDate}" AND updated <= "${endDate}" ORDER BY updated DESC`;

            const response = await axios.get<JiraSearchResponse>(
                `${this.baseUrl}/search`,
                {
                    headers: {
                        'Authorization': `Basic ${this.auth}`,
                        'Accept': 'application/json',
                    },
                    params: {
                        jql,
                        fields: 'summary,status,created,updated,assignee,reporter',
                        expand: 'changelog',
                        maxResults: 200
                    }
                }
            );

            return this.processTimelineEvents(response.data.issues);
        } catch (error) {
            console.error('Error fetching project activity by date range:', error);
            throw error;
        }
    }

    // Get recent activity summary
    async getRecentActivitySummary(projectKey: string, days = 7): Promise<{
        totalEvents: number;
        issuesCreated: number;
        issuesUpdated: number;
        statusChanges: number;
        assignmentChanges: number;
        events: TimelineEvent[];
    }> {
        const events = await this.getProjectTimeline(projectKey, { daysBack: days });

        const summary = {
            totalEvents: events.length,
            issuesCreated: events.filter(e => e.eventType === 'created').length,
            issuesUpdated: events.filter(e => e.eventType === 'updated').length,
            statusChanges: events.filter(e => e.eventType === 'status_change').length,
            assignmentChanges: events.filter(e => e.eventType === 'assignment_change').length,
            events
        };

        return summary;
    }

}


// Export the class for custom instances
export default JiraClient;