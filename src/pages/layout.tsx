import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
