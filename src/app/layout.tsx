import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Duru_Sans } from "next/font/google";
import { FloatingContact } from "@/components/FloatingContact";
import { SingleVideoPlayback } from "@/components/SingleVideoPlayback";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { StudioInfoProvider } from "@/components/StudioInfoContext";
import { getStudioContactInfo } from "@/data/studioInfo";
import "./globals.css";

const annapurna = localFont({
  src: [
    { path: "../../public/fonts/AnnapurnaSIL-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/AnnapurnaSIL-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/AnnapurnaSIL-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-annapurna",
  display: "swap",
});

const duruSans = Duru_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-duru",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shailesh Rajput Studio",
    template: "%s — Shailesh Rajput Studio",
  },
  description:
    "Shailesh Rajput Studio is a design practice creating sculptural lighting, objects, and experiences inspired by the intelligence of nature.",
};

// viewportFit: "cover" lets the page draw edge-to-edge under an iPhone's
// notch/home-indicator, which is what makes env(safe-area-inset-*) below
// actually resolve to something other than 0 — without it, fixed elements
// (the floating contact button, the full-page mobile nav) just sit at a
// hardcoded offset that either wastes space or crowds the home indicator
// depending on the device, rather than adapting to it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const studioInfo = await getStudioContactInfo();

  return (
    <html lang="en" className={`${annapurna.variable} ${duruSans.variable}`}>
      <body className="antialiased">
        <StudioInfoProvider value={studioInfo}>
          <SmoothScroll />
          <RouteTransition>{children}</RouteTransition>
          <FloatingContact />
          <SingleVideoPlayback />
        </StudioInfoProvider>
      </body>
    </html>
  );
}
