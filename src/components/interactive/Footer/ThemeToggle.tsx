import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface ThemeToggleProps {
  preferredTheme?: string | null;
  updatePreferredTheme?: (theme: string) => void;
}

export function ThemeToggle({ preferredTheme, updatePreferredTheme }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { status } = useSession();
  const loggedIn = status === "authenticated";

  // Set theme from DB
  useEffect(() => {
    if (
      preferredTheme &&
      ["light", "dark", "system"].includes(preferredTheme) &&
      preferredTheme !== resolvedTheme
    ) {
      setTheme(preferredTheme);
    }
  }, [preferredTheme]);

  const handleThemeToggle = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (loggedIn) updatePreferredTheme?.(newTheme);
  };

  return (
    <Button
      size="lg"
      onClick={handleThemeToggle}
      className="w-20 border-[1px] border-foreground/30"
    >
      <Sun className="h-[1.6rem] w-[1.6rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.6rem] w-[1.6rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-75" />
    </Button>
  );
}
