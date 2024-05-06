import { type FC } from "react";
import { MenuState } from "../AuthMenu";
import IconButton from "../IconButton";

interface IProps {
  email: string;
  setMenuState: (menuState: MenuState) => void;
}

const RegisterForm: FC<IProps> = ({ email, setMenuState }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <IconButton
        icon="back"
        size="icon"
        variant="ghost"
        onClick={() => setMenuState(MenuState.SignIn)}
      />
      <p>Register with {email}</p>
    </div>
  );
};

export default RegisterForm;