import Image from "next/image";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { LogOutIcon } from "@/components/admin/icons";
import { logout } from "../actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/brand/srs-icon.svg"
            alt=""
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7"
          />
          <span className="text-sm font-semibold text-gray-900">SRS Website Studio</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOutIcon className="h-4 w-4" />
            Log out
          </button>
        </form>
      </header>

      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
