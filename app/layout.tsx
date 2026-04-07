import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import QuickNotes from "@/components/QuickNotes";
import { AppProvider } from "@/context/AppContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NexMap — Networking Tracker",
  description: "Track your professional network and interactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AppProvider>
          <Sidebar />
          <main className="ml-56 min-h-screen p-8">{children}</main>
          <QuickNotes />
        </AppProvider>
      </body>
    </html>
  );
}
