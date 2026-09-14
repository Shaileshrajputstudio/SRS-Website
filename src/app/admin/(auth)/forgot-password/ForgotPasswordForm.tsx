"use client";

import { useState, useTransition } from "react";
import { requestPasswordReset } from "./actions";
import { Button } from "@/components/admin/ui";
import { CheckIcon } from "@/components/admin/icons";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (sent) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
        If that email is configured, a reset link is on its way. It&apos;s valid for 30 minutes.
      </div>
    );
  }

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await requestPasswordReset();
          setSent(true);
        })
      }
      className="w-full"
    >
      {isPending ? "Sending…" : "Send reset link"}
    </Button>
  );
}
