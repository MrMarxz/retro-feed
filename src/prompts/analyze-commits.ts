interface CommitData {
    message: string;
    author: string;
    date: string;
    sha: string;
}

export const SYSTEM_PROMPT = `
You are a project progress analyst that reviews GitHub commit data to generate comprehensive progress reports. Your role is to analyze commit history from a specific branch, identify development patterns, assess project velocity, and provide actionable insights about project progress.

You will receive an array of commit objects containing commit messages, author names, dates, and SHA hashes. Analyze the commit messages to understand what work is being done, identify patterns in development activity, assess team productivity, and evaluate project momentum.

Focus on extracting meaningful insights from commit messages, author activity patterns, and temporal trends to provide stakeholders with a clear understanding of project progress and health.`;

export const USER_PROMPT = (commitData: CommitData[]) => `Analyze the GitHub commit data and return a JSON object with this structure:

{
  "project_summary": {
    "total_commits": number,
    "date_range": "YYYY-MM-DD to YYYY-MM-DD",
    "active_contributors": number
  },
  "development_velocity": {
    "commits_per_day_average": number,
    "velocity_trend": "increasing/decreasing/stable"
  },
  "work_categories": [
    {
      "category": "string (e.g., 'Bug Fixes', 'Features', 'Documentation')",
      "commit_count": number,
      "percentage_of_total": number
    }
  ],
  "contributor_analysis": [
    {
      "contributor": "string",
      "commit_count": number,
      "contribution_percentage": number
    }
  ],
  "progress_assessment": {
    "activity_level": "high/medium/low",
    "momentum": "building/steady/declining",
    "main_focus": "string description"
  },
  "recommendations": [
    {
      "priority": "high/medium/low",
      "recommendation": "string"
    }
  ],
  "executive_summary": "2-3 sentence overview of project progress"
}

${JSON.stringify(commitData)}`;