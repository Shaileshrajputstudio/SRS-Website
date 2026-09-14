import { Inter } from "next/font/google";

// A dedicated UI font for the admin panel only — Inter, the standard
// choice for clean modern dashboards (Vercel, Linear, Stripe all use it)
// — deliberately different from the public site's brand fonts (Annapurna
// serif / Duru Sans), since the admin is an internal tool, not part of
// the brand experience. This layout wraps every /admin/* route (both the
// (auth) and (dashboard) route groups), so the font applies everywhere
// without needing to touch each page.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-admin min-h-screen bg-gray-50 text-gray-900`}>
      {children}
    </div>
  );
}
