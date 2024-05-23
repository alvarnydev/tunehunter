import {
  type SpotifyCurrentlyPlaying,
  type SpotifyProfileData,
  type SpotifyQueue,
  type SpotifyRecentlyPlayed,
  type SpotifyTopArtists,
  type SpotifyTopTracks,
} from "@/types/spotify";

const USER_PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
const CURRENTLY_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const QUEUE_ENDPOINT = "https://api.spotify.com/v1/me/player/queue";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
const TOP_ARTISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50";
const TOP_TRACKS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50";

export const combinedFetchSpotifyData = async (token: string) => {
  const [profileData, currentlyPlaying, queue, recentlyPlayed, topArtists, topTracks] =
    await Promise.all([
      fetchProfileData(token),
      fetchCurrentlyPlaying(token),
      fetchQueue(token),
      fetchRecentlyPlayed(token),
      fetchTopArtists(token),
      fetchTopTracks(token),
    ]);

  return { profileData, currentlyPlaying, queue, recentlyPlayed, topArtists, topTracks };
};

export const fetchProfileData = (token: string) => {
  return fetchSpotifyData<SpotifyProfileData>(token, USER_PROFILE_ENDPOINT);
};

export const fetchCurrentlyPlaying = (token: string) => {
  return fetchSpotifyData<SpotifyCurrentlyPlaying>(token, CURRENTLY_PLAYING_ENDPOINT);
};

export const fetchQueue = (token: string) => {
  return fetchSpotifyData<SpotifyQueue>(token, QUEUE_ENDPOINT);
};

export const fetchRecentlyPlayed = (token: string) => {
  return fetchSpotifyData<SpotifyRecentlyPlayed>(token, RECENTLY_PLAYED_ENDPOINT);
};

export const fetchTopArtists = (token: string) => {
  return fetchSpotifyData<SpotifyTopArtists>(token, TOP_ARTISTS_ENDPOINT);
};

export const fetchTopTracks = (token: string) => {
  return fetchSpotifyData<SpotifyTopTracks>(token, TOP_TRACKS_ENDPOINT);
};

async function fetchSpotifyData<T>(token: string, endpoint: string): Promise<T | null> {
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204 || response.status >= 400) {
    return null;
  }
  return (await response.json()) as Promise<T>;
}
