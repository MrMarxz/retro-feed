import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { anthropicClient } from "@/modules/anthropic";
import { githubClient } from "@/modules/github";

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
            
            return response;
        })
});
