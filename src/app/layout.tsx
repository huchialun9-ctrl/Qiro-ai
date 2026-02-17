import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
