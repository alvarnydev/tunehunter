import { useTranslation } from "next-i18next";
import { type FC } from "react";
import { MenuState } from "../AuthMenu";
import IconButton from "../IconButton";

interface IProps {
  email: string;
  setMenuState: (menuState: MenuState) => void;
}

const MagicLinkSentInfo: FC<IProps> = ({ email, setMenuState }) => {
  const { t } = useTranslation("");

  const magicLinkConfirmationText = t("auth.magicLink.confirm", { email });
  const magicLinkPromptText = t("auth.magicLink.prompt");

  return (
    <div className="flex flex-col items-center gap-8">
      <IconButton
        icon="back"
        size="icon"
        variant="ghost"
        onClick={() => setMenuState(MenuState.SignIn)}
      />
      <p className="text-center text-xl tracking-wide">{magicLinkConfirmationText}</p>
      <div className="w-fit">
        <IconButton icon="mailOpen" size="lg">
          <a href="mailto:">{magicLinkPromptText}</a>
        </IconButton>
      </div>
    </div>
  );
};

export default MagicLinkSentInfo;