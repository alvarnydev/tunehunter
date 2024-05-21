import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// AUTH
export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  darkMode: varchar("dark_mode", { length: 255 }).notNull(),
  language: varchar("language", { length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  queries: many(queries),
  wishlists: many(wishlists),
}));

export const accounts = pgTable(
  "account",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.userId, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 }).notNull().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Interesting data
export const queries = pgTable(
  "query",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id),
    searchedAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.songId] }),
  }),
);

export const queriesRelations = relations(queries, ({ one }) => ({
  user: one(users, {
    fields: [queries.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [queries.songId],
    references: [songs.id],
  }),
}));

export const wishlists = pgTable(
  "wishlist",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id),
    addedAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.songId] }),
  }),
);

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [wishlists.songId],
    references: [songs.id],
  }),
}));

export const songs = pgTable("song", {
  id: serial("id").primaryKey(),
  artist: varchar("artist", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 255 }).notNull(),
  album: varchar("album", { length: 255 }).notNull(),
  year: varchar("year", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  spotifyLink: varchar("spotify_link", { length: 255 }).notNull(),
});

export const songsRelations = relations(songs, ({ many }) => ({
  songListings: many(songListings),
  queries: many(queries),
  wishlists: many(wishlists),
}));

export const songVendors = pgTable("songVendor", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }).notNull(),
});

export const songVendorsRelations = relations(songVendors, ({ many }) => ({
  songListings: many(songListings),
}));

export const songListings = pgTable(
  "songListing",
  {
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id),
    vendorId: integer("vendor_id")
      .notNull()
      .references(() => songVendors.id),
    link: varchar("link", { length: 255 }).notNull(),
    quality: varchar("quality", { length: 255 }).notNull(),
    price: varchar("price", { length: 255 }).notNull(),
    currency: varchar("currency", { length: 255 }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.songId, table.vendorId] }),
  }),
);

export const songListingsRelations = relations(songListings, ({ one }) => ({
  song: one(songs, {
    fields: [songListings.songId],
    references: [songs.id],
  }),
  songVendor: one(songVendors, {
    fields: [songListings.vendorId],
    references: [songVendors.id],
  }),
}));
