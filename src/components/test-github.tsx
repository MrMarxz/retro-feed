"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const TestGithubButton: React.FC = () => {
    const mutation = api.dataSource.githubCommits.useMutation();

    const handleClick = async () => {
        const response = await mutation.mutateAsync();
        console.log("GitHub Commits:", response);
    };

    return (
        <div>
            <Button onClick={handleClick} disabled={mutation.isPending}>
                Fetch GitHub Commits
            </Button>
            {mutation.isSuccess && (
                <div className="mt-2 text-green-600">
                    {JSON.stringify(mutation.data)}
                </div>
            )}
            {mutation.isError && (
                <div className="mt-2 text-red-600">
                    Error: {mutation.error.message}
                </div>
            )}
        </div>
    );
};

export default TestGithubButton;