import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const accountRouter = createTRPCRouter({
  getSpotifyAccountById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.accounts.findFirst({
        where: (accounts, { eq }) =>
          eq(accounts.userId, input.userId) && eq(accounts.provider, "spotify"),
      });
    }),
});
