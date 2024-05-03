import { cn } from "@/lib/utils";
import { useState, type FC } from "react";
import MagicLinkSent from "./Auth/MagicLinkSent";
import Register from "./Auth/Register";
import SignIn from "./Auth/SignIn";

export enum MenuState {
  SignIn,
  MagicLinkSent,
  Register,
}

const AuthMenu: FC = ({}) => {
  const [email, setEmail] = useState<string>("");
  const [menuState, setMenuState] = useState<MenuState>(0);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "absolute-center auth-menu-transition flex w-full justify-center",
          menuState !== MenuState.SignIn && "!-translate-x-[180%]",
        )}
      >
        <div className={"w-fit"}>
          <SignIn email={email} setEmail={setEmail} setMenuState={setMenuState} />
        </div>
      </div>
      <div
        className={cn(
          "absolute-center auth-menu-transition flex w-full justify-center",
          menuState !== MenuState.MagicLinkSent && "!translate-x-[180%]",
        )}
      >
        <div className={"w-fit"}>
          <MagicLinkSent email={email} setMenuState={setMenuState} />
        </div>
      </div>
      <div
        className={cn(
          "absolute-center auth-menu-transition flex w-full justify-center",
          menuState !== MenuState.Register && "!translate-x-[180%]",
        )}
      >
        <div className={"w-fit"}>
          <Register email={email} setMenuState={setMenuState} />
        </div>
      </div>
    </div>
  );
};

export default AuthMenu;
