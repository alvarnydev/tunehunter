import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { refreshAccessToken } from "@/helpers/refresh-token";
import { db } from "@/server/db";
import { accounts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const accountRouter = createTRPCRouter({
  getSpotifyAccountById: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // Get account
    const account = await ctx.db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, userId) && eq(accounts.provider, "spotify"),
    });

    // Check if token is expired
    if (account?.expires_at && account?.refresh_token && Date.now() / 1000 > account.expires_at) {
      const { access_token, expires_at } = await refreshAccessToken(account.refresh_token);
      await db
        .update(accounts)
        .set({ access_token, expires_at })
        .where(eq(accounts.userId, userId));
    }

    return ctx.db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, userId) && eq(accounts.provider, "spotify"),
    });
  }),
});
