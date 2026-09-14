"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminPassword } from "@/lib/adminPassword";

export async function adminLogin(formData: FormData) {
  const password = formData.get("password");
  const next = (formData.get("next") as string) || "/admin";

  if (!process.env.ADMIN_PASSWORD || password !== (await getAdminPassword())) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set("srs_website_admin_session", process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next);
}
