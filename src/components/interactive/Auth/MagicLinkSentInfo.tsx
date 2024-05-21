import { Button } from "@/components/ui/button";
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
  const returnText = t("auth.returnToSignIn");

  return (
    <div className="overflow-y-auto rounded-[2rem] bg-background px-6 py-6 md:px-8 md:py-6 lg:px-10 lg:py-8 ">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p>{magicLinkConfirmationText}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <IconButton icon="mailOpen" size="lg" variant="primary">
            <a href="mailto:">{magicLinkPromptText}</a>
          </IconButton>
          <Button variant="link" onClick={() => setMenuState(MenuState.SignIn)}>
            {returnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkSentInfo;
