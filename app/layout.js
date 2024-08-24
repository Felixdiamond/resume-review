import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/toaster";
import '@/lib/polyfill2';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI resume reviewer",
  description: "Created by Ayane 🫸🔵🔴🫷🫴🟣",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  );
}
