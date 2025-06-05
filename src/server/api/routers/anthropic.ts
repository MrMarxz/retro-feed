import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { anthropicClient } from "@/modules/anthropic";

export const anthropicRouter = createTRPCRouter({
    hello: publicProcedure
        .mutation(async ({ input }) => {
            // Fetch from Anthropic API
            const response = await anthropicClient.test();
            return response;
        }),
});
