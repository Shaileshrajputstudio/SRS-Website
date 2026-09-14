import Image from "next/image";
import Link from "next/link";
import { studio } from "@/lib/studio";
import { Input, Button, Card } from "@/components/admin/ui";
import { CheckIcon } from "@/components/admin/icons";
import { adminLogin } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; reset?: string }>;
}) {
  const { next = "/admin", error, reset } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <Card className="w-full max-w-sm p-8">
        <Image
          src="/brand/srs-icon.svg"
          alt={studio.name}
          width={40}
          height={40}
          unoptimized
          priority
          className="mb-6 h-9 w-9"
        />
        <p className="mb-1 text-xs font-medium tracking-wide text-gray-400 uppercase">SRS Website</p>
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Studio Sign In</h1>

        {reset === "success" && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
            Password updated — log in with your new password.
          </div>
        )}

        <form action={adminLogin} className="w-full">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-500">
            Password
          </label>
          <Input id="password" type="password" name="password" autoFocus className="mb-4" />
          {error && <p className="mb-4 text-sm text-red-600">Incorrect password — please try again.</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <Link
          href="/admin/forgot-password"
          className="mt-5 block text-center text-xs text-gray-400 hover:text-gray-600"
        >
          Forgot password?
        </Link>
      </Card>
    </div>
  );
}
