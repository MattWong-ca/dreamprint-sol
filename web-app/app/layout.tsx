import type { Metadata } from "next";
import { Geist_Mono, Montserrat_Alternates, Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Dreamprint",
  description: "NFT polaroids for events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistMono.variable} ${montserratAlternates.variable} antialiased font-[family-name:var(--font-poppins)]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
