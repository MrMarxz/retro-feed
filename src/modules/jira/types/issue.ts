export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
    created: string;
  };
}

export interface JiraResponse {
  issues: JiraIssue[];
  total: number;
}