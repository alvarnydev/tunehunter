import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const songRouter = createTRPCRouter({
  getTrending: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.queries.findMany({
      orderBy: (queries, { desc }) => [desc(queries.searchedAt)],
      with: { song: true },
      limit: 30,
    });
  }),

  getHistory: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.queries.findMany({
      where: (queries, { eq }) => eq(queries.userId, ctx.session.user.id),
      with: { song: true },
      orderBy: (queries, { desc }) => [desc(queries.searchedAt)],
      limit: 30,
    });
  }),

  getWishlist: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.wishlists.findMany({
      where: (wishlist, { eq }) => eq(wishlist.userId, ctx.session.user.id),
      with: { song: true },
      orderBy: (wishlist, { desc }) => [desc(wishlist.addedAt)],
      limit: 30,
    });
  }),
});
