import Navbar from "@/components/layout/navbar/NavBar";
import React, { PropsWithChildren } from "react";
import Footer from "@/components/layout/Footer";

function MainLayout({ children }: PropsWithChildren) {
  return <>
    <Navbar />
      <main className="flex-1">{children}</main>
    <Footer />
  </>;
}

export default MainLayout;
