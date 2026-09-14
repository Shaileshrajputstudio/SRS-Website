import Image from "next/image";
import Link from "next/link";
import { studio } from "@/lib/studio";
import { Card } from "@/components/admin/ui";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

// Masks everything but the first character and the domain, so the page can
// reassure whoever's looking ("yes, this is going to the right inbox")
// without fully exposing the address — this page is reachable by anyone
// who finds the login screen, logged in or not.
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(local.length - 1, 3))}@${domain}`;
}

export default function ForgotPasswordPage() {
  const recoveryEmail = process.env.PASSWORD_RECOVERY_EMAIL;

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
        <h1 className="mb-2 text-xl font-semibold text-gray-900">Forgot password</h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          {recoveryEmail
            ? `We'll send a reset link to ${maskEmail(recoveryEmail)}.`
            : "We'll send a reset link to the studio's recovery email."}
        </p>

        <ForgotPasswordForm />

        <Link href="/admin/login" className="mt-5 block text-center text-xs text-gray-400 hover:text-gray-600">
          Back to login
        </Link>
      </Card>
    </div>
  );
}
