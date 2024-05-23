import { env } from "@/env";
import { SpotifyRefreshData } from "@/types/spotify";
import { JWT } from "next-auth/jwt";

export async function refreshAccessToken(oldRefreshToken: string) {
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshUrl = "https://accounts.spotify.com/api/token";

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(refreshUrl, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: oldRefreshToken,
      }),
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-cache",
    });
    const data: SpotifyRefreshData = await response.json();

    return {
      access_token: data.access_token,
      expires_at: Math.round((Date.now() + data.expires_in * 1000) / 1000),
    };
  } catch (error) {
    return {
      error: "RefreshAccessTokenError",
    };
  }
}
