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
    <>
      <div className="relative w-full">
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center transition-transform duration-500 ease-in-out",
            menuState !== MenuState.SignIn && "-translate-x-[150%]",
          )}
        >
          <div className={"w-fit"}>
            <SignIn email={email} setEmail={setEmail} setMenuState={setMenuState} />
          </div>
        </div>
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center transition-transform duration-500 ease-in-out",
            menuState !== MenuState.MagicLinkSent && "translate-x-[150%]",
          )}
        >
          <div className={"w-fit"}>
            <MagicLinkSent email={email} />
          </div>
        </div>
        <div
          className={cn(
            "absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center transition-transform duration-500 ease-in-out",
            menuState !== MenuState.Register && "translate-x-[150%]",
          )}
        >
          <div className={"w-fit"}>
            <Register email={email} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthMenu;
