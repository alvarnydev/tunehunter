import { useEffect, useState, type FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
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

  const [menuApi, setMenuApi] = useState<CarouselApi>();
  useEffect(() => {
    menuApi?.scrollTo(menuState);
  }, [menuState]);

  return (
    <Carousel setApi={setMenuApi}>
      <CarouselContent>
        <CarouselItem>
          <SignIn email={email} setEmail={setEmail} setMenuState={setMenuState} />
        </CarouselItem>
        <CarouselItem>
          {menuState === MenuState.MagicLinkSent && <MagicLinkSent email={email} />}
          {menuState === MenuState.Register && <Register />}
        </CarouselItem>
      </CarouselContent>
      {(menuState === MenuState.MagicLinkSent || menuState === MenuState.Register) && (
        <CarouselPrevious />
      )}
    </Carousel>
  );
};

export default AuthMenu;
