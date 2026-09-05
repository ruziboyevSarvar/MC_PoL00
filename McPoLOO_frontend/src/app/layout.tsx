import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { getSiteUrl } from "@/utils/url";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: {
    default: "McPoLOO | Premium European Line",
    template: "%s | Mc PoLOO"
  },
  description: "Designer smesitel va santexnika. Premium sifat darajasi, 5 yil rasmiy garantiya va Butun O'zbekiston bo'ylab yetkazib berish.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "McPoLOO | Premium European Line",
    description: "Designer smesitel va premium santexnika mahsulotlari.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body suppressHydrationWarning className={`${manrope.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
