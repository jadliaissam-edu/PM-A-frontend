import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/providers";

export const metadata: Metadata = {
  title: "AgileFlow",
  description: "Project management platform frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}