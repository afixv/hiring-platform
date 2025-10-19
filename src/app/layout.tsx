import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Hiring Platform",
  description: "Platform untuk mencari dan merekrut talenta terbaik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
