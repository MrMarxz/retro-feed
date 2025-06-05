export interface ProgressReport {
  project_summary: {
    total_commits: number;
    date_range: string;
    active_contributors: number;
  };
  development_velocity: {
    commits_per_day_average: number;
    velocity_trend: "increasing" | "decreasing" | "stable";
  };
  work_categories: Array<{
    category: string;
    commit_count: number;
    percentage_of_total: number;
  }>;
  contributor_analysis: Array<{
    contributor: string;
    commit_count: number;
    contribution_percentage: number;
  }>;
  progress_assessment: {
    activity_level: "high" | "medium" | "low";
    momentum: "building" | "steady" | "declining";
    main_focus: string;
  };
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    recommendation: string;
  }>;
  executive_summary: string;
}