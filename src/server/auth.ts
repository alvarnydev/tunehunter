import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { env } from "@/env";
import { eq } from "drizzle-orm";

import { refreshAccessToken } from "@/helpers/refresh-token";
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
    } & DefaultSession["user"] &
      UserSettings;
  }

  interface UserSettings {
    language: string;
    theme: string;
    region: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/?profile=login",
    signOut: "/?profile",
    error: "/?profile=login", // &error=errorCode is added by Next Auth
  },
  callbacks: {
    // We're using an adapter, so we're using the 'database' strategy (which also enables us to use the Email SignIn method) and there is no JWT; instead there is a sessionToken cookie which is used to look up the session in the DB
    // If we had been using JWT, we could access the DB here, add stuff to the token and then retrieve that in the 'session' callback to propagate fields to the client
    // jwt: ({ token, account, user }) => {
    //   console.log("jwt", token, account, user);
    //   if (account) {
    //     token.id = user.id;
    //     token.language = "EN";
    //   }
    //   return token;
    // },

    // So the question remains, why does the AdapterUser not have access to language, region and theme from our DB?
    session: ({ session, user }) => {
      return {
        expires: session.expires,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },

    signIn: async ({ user, account }) => {
      if (account?.expires_at && account?.refresh_token && Date.now() / 1000 > account.expires_at) {
        const { access_token, expires_at } = await refreshAccessToken(account.refresh_token);
        await db
          .update(accounts)
          .set({ access_token, expires_at })
          .where(eq(accounts.userId, user.id));
      }
      return true;
    },
  },
  adapter: DrizzleAdapter(db, pgTable) as Adapter,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      maxAge: 10 * 60, // Links and codes are valid for 10 minutes
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
