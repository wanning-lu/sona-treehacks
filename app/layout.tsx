import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sona TreeHacks",
  description: "Full-stack Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
