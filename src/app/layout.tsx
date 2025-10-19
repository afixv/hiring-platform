import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";


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
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
