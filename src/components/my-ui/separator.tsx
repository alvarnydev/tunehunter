import clsx from "clsx";
import { type FC, type ReactNode } from "react";

interface IProps {
  borderColor?: string;
  text?: string;
  children?: ReactNode;
}

export const Separator: FC<IProps> = ({ borderColor, children }) => (
  <div className="flex w-full">
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className={clsx("w-full border-t", borderColor)} />
      </div>
    </div>
    {children}
    <div className="relative flex-1">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <span className={clsx("w-full border-t", borderColor)} />
      </div>
    </div>
  </div>
);
