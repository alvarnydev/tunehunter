import Footer from "@/components/layout/Footer";
const Particles = dynamic(() => import("@/components/layout/Particles"), {
  ssr: false,
});

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen rotate-0 flex-col items-center justify-between overflow-hidden bg-background text-foreground">
      {theme === "dark" && (
        <Particles
          className="animate-fade-in absolute inset-0 -z-10"
          quantity={100}
        />
      )}
      <main className="relative flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-16">
        {/* <Header /> */}
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
