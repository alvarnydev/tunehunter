import { z } from "zod";

import { RegisterSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { accounts, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter(
  {
    hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

    getSecretMessage: protectedProcedure.query(() => {
      return "you can now see this secret message!";
    }),

    // useform, crete account and user
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

    getUserByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(({ ctx, input }) => {
        return ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        });
      }),
  },

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
);
