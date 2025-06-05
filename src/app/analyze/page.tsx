'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GitCommit, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '@/trpc/react';

interface ProgressReport {
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

export default function GitHubProgressPage() {
    const [reportData, setReportData] = useState<ProgressReport | null>(null);

    const mutation = api.dataSource.githubCommits.useMutation({
        onSuccess: (data) => {
            setReportData(data);
        },
        onError: (error) => {
            console.error('Error fetching GitHub commits:', error);
        }
    });

    const handleRunReport = () => {
        mutation.mutate();
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return '📈';
            case 'decreasing':
                return '📉';
            default:
                return '➡️';
        }
    };

    const getActivityColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'destructive' as const;
            case 'medium':
                return 'default' as const;
            case 'low':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">GitHub Progress Report</h1>
                <p className="text-muted-foreground">
                    Analyze your {"project's"} development progress and team activity
                </p>
            </div>

            <div className="mb-6">
                <Button
                    onClick={handleRunReport}
                    disabled={mutation.isPending}
                    className="w-full sm:w-auto"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Commits...
                        </>
                    ) : (
                        <>
                            <GitCommit className="mr-2 h-4 w-4" />
                            Run Progress Report
                        </>
                    )}
                </Button>
            </div>

            {mutation.error && (
                <Alert className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Error: {mutation.error.message}
                    </AlertDescription>
                </Alert>
            )}

            {reportData && (
                <div className="space-y-6">
                    {/* Executive Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Executive Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">{reportData.executive_summary}</p>
                        </CardContent>
                    </Card>

                    {/* Project Summary & Velocity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GitCommit className="h-5 w-5" />
                                    Project Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Total Commits:</span>
                                    <Badge variant="outline">{reportData.project_summary.total_commits}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date Range:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {reportData.project_summary.date_range}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Active Contributors:</span>
                                    <Badge variant="outline">{reportData.project_summary.active_contributors}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Development Velocity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Commits/Day:</span>
                                    <Badge variant="outline">
                                        {reportData.development_velocity.commits_per_day_average.toFixed(1)}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Trend:</span>
                                    <div className="flex items-center gap-2">
                                        <span>{getTrendIcon(reportData.development_velocity.velocity_trend)}</span>
                                        <Badge variant="outline">
                                            {reportData.development_velocity.velocity_trend}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Progress Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Activity Level:</span>
                                <Badge className={getActivityColor(reportData.progress_assessment.activity_level)}>
                                    {reportData.progress_assessment.activity_level.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Momentum:</span>
                                <Badge variant="outline">{reportData.progress_assessment.momentum}</Badge>
                            </div>
                            <div>
                                <span className="font-medium">Main Focus:</span>
                                <p className="text-muted-foreground mt-1">{reportData.progress_assessment.main_focus}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Categories</CardTitle>
                            <CardDescription>Distribution of development efforts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reportData.work_categories.map((category, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{category.category}</span>
                                            <span className="text-muted-foreground">
                                                {category.commit_count} commits ({category.percentage_of_total.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <Progress value={category.percentage_of_total} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contributors */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Contributor Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {reportData.contributor_analysis.map((contributor, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div>
                                            <span className="font-medium">{contributor.contributor}</span>
                                            <p className="text-sm text-muted-foreground">
                                                {contributor.commit_count} commits
                                            </p>
                                        </div>
                                        <Badge variant="outline">
                                            {contributor.contribution_percentage.toFixed(1)}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {reportData.recommendations.map((rec, index) => (
                                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                                        <Badge variant={getPriorityVariant(rec.priority)} className="shrink-0">
                                            {rec.priority.toUpperCase()}
                                        </Badge>
                                        <p className="text-sm">{rec.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}