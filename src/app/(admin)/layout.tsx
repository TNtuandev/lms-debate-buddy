import React, { PropsWithChildren } from "react";
import Navbar from "@/components/layout/navbar/NavBar";
import Footer from "@/components/layout/Footer";

function AdminLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export default AdminLayout;
