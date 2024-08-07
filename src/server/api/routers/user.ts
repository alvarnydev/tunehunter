import { z } from "zod";

import { RegisterSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { accounts, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  createAccount: publicProcedure.input(RegisterSchema).mutation(async ({ ctx, input }) => {
    const validatedFields = RegisterSchema.safeParse(input);
    if (!validatedFields.success) return { error: "invalidFields" };

    // Check existing user
    const existingUser = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, input.email),
    });
    if (existingUser) return { error: "accountAlreadyExists" };

    // Create user
    await ctx.db.insert(users).values({ name: input.name, email: input.email });

    // Get user id
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, input.email),
    });
    if (!user) return { error: "generalError" };

    // Create account
    await ctx.db.insert(accounts).values({
      userId: user.id,
      type: "email",
      provider: "email",
      providerAccountId: `email-${user.id}`,
    });

    return { success: "accountCreated" };
  }),

  getUserById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, input.id),
    });
  }),

  deleteUserAndAccountsById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id)).returning();
    }),

  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });
    }),

  getUserSettings: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.userId),
      });
      if (!user) return { error: "userNotFound" };
      return {
        id: user.id,
        language: user.language,
        theme: user.theme,
        region: user.region,
      };
    }),

  setUserSettings: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        language: z.string().optional(),
        theme: z.string().optional(),
        region: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          language: input.language ?? ctx.session.user.language,
          theme: input.theme ?? ctx.session.user.theme,
          region: input.region ?? ctx.session.user.region,
        })
        .where(eq(users.id, input.id));
    }),
});
