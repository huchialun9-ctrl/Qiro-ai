import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Qiroai | Where Ideas Flow",
  description: "A generative collaboration space with an infinite canvas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
