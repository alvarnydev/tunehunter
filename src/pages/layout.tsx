import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Particles from "@/components/layout/Particles";
import { type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen rotate-0 flex-col items-center justify-between overflow-hidden bg-black">
      <Particles className="animate-fade-in absolute inset-0 -z-10" quantity={100} />
      <main className="relative flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-16">
        <Header />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
