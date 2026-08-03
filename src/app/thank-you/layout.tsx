import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | IJM First City",
  description: "Thank you for your enquiry. Our property advisor will contact you shortly.",
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
