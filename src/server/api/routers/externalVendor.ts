import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const externalVendorRouter = createTRPCRouter({
  getSongData: publicProcedure
    .input(z.object({ queryTerm: z.string(), country: z.string() }))
    .query(async ({ ctx, input }) => {
      // const apiUrl = new URL(
      //   `https://itunes.apple.com/search?country=${input.country}&media=music&entity=song&limit=5&term=${input.queryTerm}`,
      // ).href;
      // if (album) apiUrl += `+${album}`;
      // const response = await axios.get<ITunesData>(apiUrl);
      // const data = response.data;
      // // Grab what we need from the response
      // const previewData: TrackData[] = data.results.map((song) => {
      //   return {
      //     title: song.trackName,
      //     artist: song.artistName,
      //     album: song.collectionName,
      //     duration: song.trackTimeMillis,
      //     qualityFormat: "AAC", // todo: figure out format from song.previewUrl
      //     qualityKbps: 256, // todo: figure out kbps from song.previewUrl
      //     price: song.trackPrice,
      //     songLink: song.trackViewUrl,
      //     artLink: song.artworkUrl100.replace("100x100", "400x400"),
      //   };
      // });
      // if (duration) {
      //   previewData.sort(sortByMatchingDuration(duration));
      // }
      // return previewData;
    }),

  getItunesData: publicProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ ctx, input }) => {
      // 1. Try DB first (will hit because of ID search before)
      // If no DB, hit external API
    }),

  getBeatportData: publicProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ ctx, input }) => {
      // 1. Try DB first
      // If no DB, hit external API
      // If no external API, hit scraper
    }),

  getAmazonData: publicProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ ctx, input }) => {
      // 1. Try DB first
      // If no DB, hit external API
      // If no external API, hit scraper
    }),

  getBandcampData: publicProcedure
    .input(z.object({ songId: z.number() }))
    .query(async ({ ctx, input }) => {
      // 1. Try DB first
      // If no DB, hit external API
      // If no external API, hit scraper
    }),
});

// export const fetchPreviewData = async ({ country, title, artist, duration, album }: DataRequestQuery): Promise<TrackData[]> => {
//   let dataUrl = new URL(`https://itunes.apple.com/search?country=${country}&media=music&entity=song&limit=5&term=${title}+${artist}`).href;
//   if (album) dataUrl += `+${album}`;
//   const response = await axios.get<ITunesData>(dataUrl);
//   const data = response.data;

//   // Grab what we need from the response
//   const previewData: TrackData[] = data.results.map((song) => {
//     return {
//       title: song.trackName,
//       artist: song.artistName,
//       album: song.collectionName,
//       duration: song.trackTimeMillis,
//       qualityFormat: 'AAC', // todo: figure out format from song.previewUrl
//       qualityKbps: 256, // todo: figure out kbps from song.previewUrl
//       price: song.trackPrice,
//       songLink: song.trackViewUrl,
//       artLink: song.artworkUrl100.replace('100x100', '400x400'),
//     };
//   });

//   if (duration) {
//     previewData.sort(sortByMatchingDuration(duration));
//   }
//   return previewData;
// };
