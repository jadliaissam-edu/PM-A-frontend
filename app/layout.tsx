import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/providers";
import PublicLanding from "./components/PublicLanding";

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
        <PublicLanding />
      </body>
    </html>
  );
}
