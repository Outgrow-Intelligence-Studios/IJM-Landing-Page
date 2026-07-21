import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IJM First City Harmony Mihan, Nagpur | Premium 2, 2.5 & 3 BHK Apartments",
  description: "Experience luxury living at IJM First City Mihan, Nagpur. A premium 7.5-acre gated community featuring 690 apartments, 100+ amenities, clubhouse, and unmatched connectivity. Enquire now for starting price ₹73 Lakhs.",
  keywords: "IJM First City, First City Nagpur, MIHAN apartments, flats in Nagpur, Harmony Mihan, Symphony Mihan, Nagpur property, IJM Group",
  authors: [{ name: "Nagpur Integrated Township Pvt. Ltd." }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} scroll-smooth`}>
      <body className="antialiased text-white bg-[#0a0808]">
        {children}
      </body>
    </html>
  );
}
