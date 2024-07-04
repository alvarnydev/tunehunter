import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const songRouter = createTRPCRouter({
  getTrending: publicProcedure.query(async ({ ctx }) => {
    // const trending = ctx.db.select("songId").from("queries").groupBy("songId").orderBy("count(*)", "desc").limit(30);
    const popularQueries = await ctx.db.query.queries.findMany({
      orderBy: (queries, { desc }) => [desc(queries.searchedAt)],
      limit: 30,
    });

    // Turn queries into a list of song ids
    const songIds = popularQueries.map((query) => query.songId);
    return ctx.db.query.songs.findMany({
      where: (song, { inArray }) => inArray(song.id, songIds),
    });
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const userQueries = await ctx.db.query.queries.findMany({
      where: (queries, { eq }) => eq(queries.userId, ctx.session.user.id),
      orderBy: (queries, { desc }) => [desc(queries.searchedAt)],
      limit: 30,
    });

    // Turn the queries into a list of songs using the song ids
    const songIds = userQueries.map((query) => query.songId);
    return ctx.db.query.songs.findMany({
      where: (song, { inArray }) => inArray(song.id, songIds),
    });
  }),

  getWishlist: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.wishlists.findMany({
      where: (wishlist, { eq }) => eq(wishlist.userId, ctx.session.user.id),
      orderBy: (wishlist, { desc }) => [desc(wishlist.addedAt)],
      limit: 30,
    });
  }),
});
