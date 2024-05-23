import { env } from "@/env";

export const refreshTokens = async (refreshToken: string) => {
  const url = new URL("https://accounts.spotify.com/api/token");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.SPOTIFY_CLIENT_ID,
    }),
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  const { access_token, refresh_token } = data;

  return { access_token, refresh_token };
};
