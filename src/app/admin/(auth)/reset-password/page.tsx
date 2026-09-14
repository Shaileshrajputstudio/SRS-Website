import Image from "next/image";
import { studio } from "@/lib/studio";
import { verifyResetToken } from "@/lib/passwordReset";
import { Card, LinkButton } from "@/components/admin/ui";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const valid = await verifyResetToken(token);

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
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Reset password</h1>

        {valid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
            <LinkButton href="/admin/forgot-password" className="w-full">
              Request new link
            </LinkButton>
          </>
        )}
      </Card>
    </div>
  );
}
