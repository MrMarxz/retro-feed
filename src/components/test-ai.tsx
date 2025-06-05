"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const TestClaudeButton: React.FC = () => {
    const mutation = api.anthropic.hello.useMutation();

    const handleClick = () => {
        mutation.mutate();
    };

    return (
        <div>
            <Button onClick={handleClick} disabled={mutation.isPending}>
                Run Anthropic Hello
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

export default TestClaudeButton;