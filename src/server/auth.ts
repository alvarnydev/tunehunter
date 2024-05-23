import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { env } from "@/env";
import { eq } from "drizzle-orm";

import { refreshTokens } from "@/helpers/refresh-token";
import { db } from "@/server/db";
import { pgTable } from "drizzle-orm/pg-core";
import EmailProvider from "next-auth/providers/email";
import SpotifyProvider from "next-auth/providers/spotify";
import { accounts } from "./db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    signIn: async ({ user, account, profile, email, credentials }) => {
      if (
        account?.expires_at &&
        account?.access_token &&
        account?.refresh_token &&
        Date.now() > account.expires_at
      ) {
        console.log("refreshing token");
        const { access_token, refresh_token } = await refreshTokens(account.refresh_token);
        console.log("access_token", access_token, "refresh_token", refresh_token);
        await db
          .update(accounts)
          .set({ access_token: access_token, refresh_token: refresh_token })
          .where(eq(accounts.userId, user.id));
      }
      return true;
    },
  },
  adapter: DrizzleAdapter(db, pgTable) as Adapter,
  /**
   * @see https://next-auth.js.org/providers/github
   */
  // pages: {
  //   error: "/?profile=error",
  //   newUser: "/?profile=register",
  //   signIn: "/?profile=login",
  //   signOut: "?profile=open",
  // },
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,user-read-currently-playing,user-read-playback-state,user-read-recently-played,user-top-read",
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
