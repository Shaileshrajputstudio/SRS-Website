"use client";

import { createContext, useContext } from "react";
import type { StudioContactInfo } from "@/data/studioInfo";

const StudioInfoContext = createContext<StudioContactInfo | null>(null);

// Fetched once, server-side, in the root layout — client components that
// need phone/whatsapp/email/socials (FloatingContact, AcquireForm) read
// it from here instead of each fetching it themselves, since Client
// Components can't run the async Supabase query directly.
export function StudioInfoProvider({
  value,
  children,
}: {
  value: StudioContactInfo;
  children: React.ReactNode;
}) {
  return <StudioInfoContext.Provider value={value}>{children}</StudioInfoContext.Provider>;
}

export function useStudioInfo(): StudioContactInfo {
  const ctx = useContext(StudioInfoContext);
  if (!ctx) throw new Error("useStudioInfo must be used within StudioInfoProvider");
  return ctx;
}
