import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Yuan Carlo M. Chin — Web Developer",
  description:
    "Portfolio of Yuan Carlo M. Chin, a web developer specializing in clean, minimal, and functional digital experiences. BSIT student at Holy Angel University.",
  keywords:
    "Yuan Carlo Chin, web developer, portfolio, Holy Angel University, BSIT, frontend developer Philippines",
  authors: [{ name: "Yuan Carlo M. Chin" }],
  openGraph: {
    title: "Yuan Carlo M. Chin — Web Developer",
    description: "Building refined digital experiences with discipline and clarity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}