import { type FC } from "react";

interface IProps {
  email: string;
}

const Register: FC<IProps> = ({ email }) => {
  return <div>Register with {email}</div>;
};

export default Register;
