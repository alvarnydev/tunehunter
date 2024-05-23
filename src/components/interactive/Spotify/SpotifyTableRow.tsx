// import { MusicPlayingIndicator } from "@/components/MusicPlayingIndicator";
// import { useTranslation } from "next-i18next";

// const SpotifyTableRow: React.FC<{
//   trackData: SpotifyTrack;
//   currentlyPlaying?: boolean;
//   userCountry?: string;
// }> = ({ trackData, currentlyPlaying, userCountry }) => {
//   const { t } = useTranslation();

//   const startSearch = () => {
//     const newFormData = {
//       country: userCountry || "DE",
//       artist: trackData.artists[0].name,
//       title: trackData.name,
//       duration: trackData.duration_ms,
//       album: trackData.album.name,
//     };

//     // handleFormUpdate(newFormData);
//     handleSubmit(newFormData);
//   };

//   return (
//     <tr className="relative [&>td]:rounded-none [&>td]:border-0">
//       <td>
//         <div className="flex items-center gap-3">
//           <div className="avatar pr-2">
//             <div className={`mask mask-squircle h-10 w-10 `}>
//               <img
//                 src={trackData.album.images[0].url}
//                 alt="Avatar Tailwind CSS Component"
//                 className="relative"
//               />
//             </div>
//           </div>
//           <div>
//             <div>{trackData.artists[0].name}</div>
//             <div className="text-sm opacity-50">{trackData.artists[1]?.name}</div>
//           </div>
//         </div>
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
//           {currentlyPlaying && <MusicPlayingIndicator size={12} />}
//           <div className="inline">
//             {trackData.name.length >= 40 ? `${trackData.name.substring(0, 40)}...` : trackData.name}
//           </div>
//         </div>
//       </td>
//       <td className="absolute right-0">
//         <button className="btn btn-outline btn-primary btn-xs rounded-full" onClick={startSearch}>
//           {t("searchbar.search")}
//         </button>
//       </td>
//     </tr>
//   );
// };
