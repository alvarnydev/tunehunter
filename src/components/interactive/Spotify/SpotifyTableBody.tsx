// import { RefObject, useLayoutEffect } from "react";

// interface ISpotifyTableBodyProps {
//   tab: string;
//   tableRef: RefObject<HTMLDivElement>;
//   tableHeight: number;
//   tableScroll: number;
// }

// const SpotifyTableBody = ({ tab, tableRef, tableHeight, tableScroll }: ISpotifyTableBodyProps) => {
//   const { userData } = useAuth();

//   // Restore table height (tailwind stops evaluating h-[${tableHeight.current}px] correctly after some time, for whatever reason)
//   useLayoutEffect(() => {
//     if (tableRef.current == null) return;
//     tableRef.current.style.height = `${tableHeight}px`;
//     tableRef.current.scrollTop = tableScroll;
//   }, []);

//   const QueueTable = () => {
//     if (data.queue?.queue.length == 0)
//       return (
//         <div className="flex h-full items-center justify-center">
//           <p className="text-center">Your queue is currently empty</p>
//         </div>
//       );

//     return (
//       <table className="table w-full table-fixed">
//         <tbody>
//           {data.queue?.queue.map((item, index) => (
//             <TrackRow
//               key={index}
//               trackData={item}
//               userCountry={data.profileData?.country}
//               handleSubmit={handleSubmit}
//             />
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div
//       ref={tableRef}
//       className={`scrollbar-none w-full resize-y overflow-x-auto rounded py-2 h-[${tableHeight}px]`}
//     >
//       {tab == "recentlyPlayed" && (
//         <RecentlyPlayedTable data={userData} handleSubmit={handleSubmit} />
//       )}
//       {tab == "mostPlayed" && <MostPlayedTable data={userData} handleSubmit={handleSubmit} />}
//       {tab == "queue" && <QueueTable data={userData} handleSubmit={handleSubmit} />}
//     </div>
//   );
// };

// export default SpotifyTableBody;
