import IconButton from "@/components/IconButton";
import { CustomIconType } from "@/helpers/custom-icons";
import { spotifyMockData } from "@/helpers/mock-spotify-data";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { FC, MouseEventHandler } from "react";
import SpotifyTableRow from "../SpotifyTableRow";

interface IProps {
  promptText: string;
  icon?: CustomIconType;
  onClickFunc?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const LoginPromptMockTable: FC<IProps> = ({ promptText, icon, onClickFunc }) => {
  const router = useRouterWithHelpers();

  return (
    <>
      <div className="absolute-center z-30">
        <IconButton
          icon={icon}
          variant="primary"
          text={promptText}
          size="lg"
          onClick={onClickFunc ? onClickFunc : () => router.setParams({ profile: "login" }, false)}
        />
      </div>
      <div className="hide-scrollbars relative h-full w-full px-3 py-4 sm:px-5 md:px-7">
        <div className="absolute inset-0 z-20 backdrop-blur-2xl" />
        <table className="w-full">
          <tbody>
            {spotifyMockData.topTracks!.items.map((track) => (
              <SpotifyTableRow key={track.id} track={track} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LoginPromptMockTable;
