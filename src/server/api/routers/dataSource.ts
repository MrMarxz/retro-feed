import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { anthropicClient } from "@/modules/anthropic";
import { githubClient } from "@/modules/github";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/prompts/analyze-commits";

export const dataSourceRouter = createTRPCRouter({
    hello: publicProcedure
        .mutation(async ({ input }) => {
            // Fetch from Anthropic API
            const response = await anthropicClient.test();
            return response;
        }),
    githubCommits: publicProcedure
        .mutation(async () => {
            const owner = "MrMarxz";
            const repo = "taskit";
            const branch = "main";

            // Fetch from GitHub API
            const response = await githubClient.fetchCommitMessages(
                owner,
                repo,
                branch,
                10
            );
            
            // Send data to Anthropic for analysis
            const result = await anthropicClient.analyzeGithub(SYSTEM_PROMPT, USER_PROMPT(response));
            return result;
        })
});
