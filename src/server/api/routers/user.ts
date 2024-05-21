import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

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

    getUser: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(({ ctx, input }) => {
        const user = ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        });
        return user;
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
