import { useTranslation } from "next-i18next";
import { type FC } from "react";
import IconButton from "../IconButton";

interface IProps {
  email: string;
}

const MagicLinkSent: FC<IProps> = ({ email }) => {
  const { t } = useTranslation("");

  const magicLinkConfirmationText = t("auth.magicLink.confirm", { email });
  const magicLinkPromptText = t("auth.magicLink.prompt");

  return (
    <div className="flex flex-col items-center gap-8 ">
      <p className="text-center text-xl tracking-wide">{magicLinkConfirmationText}</p>
      <div className="w-fit">
        <IconButton icon="mailOpen" sizeVariant="lg">
          <a href="mailto:">{magicLinkPromptText}</a>
        </IconButton>
      </div>
    </div>
  );
};

export default MagicLinkSent;
