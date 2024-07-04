import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface AuthCardProps {
  label: string;
  children: ReactNode;
  size?: "small" | "default" | "big";
}

const AuthCard = ({ label, children, size = "default" }: AuthCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 overflow-y-auto rounded-[2rem] border-[1px] border-foreground bg-background px-6 py-6 md:px-8 md:py-6 lg:px-10 lg:py-8",
        size === "small" && "min-w-80 max-w-sm",
        size === "default" && "max-w-lg",
        size === "big" && "max-w-4xl",
      )}
    >
      <p className="text-center">{label}</p>
      {children}
    </div>
  );
};

export default AuthCard;
