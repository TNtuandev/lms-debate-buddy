import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@smastrom/react-rating/style.css";
import QueryProvider from "@/context/QueryBuilder";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "E-learning",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    return;
  }

  return (
    <html>
      <body className="flex flex-col min-h-screen">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              position="top-center"
              toastOptions={{ duration: 5000, removeDelay: 1000 }}
            />
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
