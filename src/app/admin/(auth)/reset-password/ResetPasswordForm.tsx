"use client";

import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "./actions";
import { Input, Button } from "@/components/admin/ui";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="token" value={token} />

      <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium text-gray-500">
        New Password
      </label>
      <Input
        id="newPassword"
        type="password"
        name="newPassword"
        required
        minLength={6}
        autoFocus
        autoComplete="new-password"
        className="mb-4"
      />

      <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-gray-500">
        Confirm New Password
      </label>
      <Input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        required
        minLength={6}
        autoComplete="new-password"
        className="mb-4"
      />

      {state.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
