
export interface JiraResponse {
    issues: JiraIssue[];
    total: number;
}

export interface JiraUser {
    displayName: string;
    emailAddress: string;
}

export interface JiraHistoryItem {
    field: string;
    fieldtype: string;
    from: string | null;
    fromString: string | null;
    to: string | null;
    toString: string | null;
}

export interface JiraChangelogEntry {
    id: string;
    author: JiraUser;
    created: string;
    items: JiraHistoryItem[];
}

export interface JiraIssue {
    key: string;
    fields: {
        summary: string;
        status: {
            name: string;
        };
        created: string;
        updated: string;
        assignee?: JiraUser;
        reporter: JiraUser;
    };
    changelog?: {
        histories: JiraChangelogEntry[];
    };
}

export interface JiraSearchResponse {
    issues: JiraIssue[];
    total: number;
    startAt: number;
    maxResults: number;
}

export interface TimelineEvent {
    issueKey: string;
    issueSummary: string;
    eventType: 'created' | 'updated' | 'status_change' | 'assignment_change' | 'other';
    timestamp: string;
    author: string;
    description: string;
    details?: {
        field?: string;
        from?: string | null;
        to?: string | null;
    };
}

