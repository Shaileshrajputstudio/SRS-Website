"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { changePassword, type ChangePasswordState } from "@/app/admin/actions";
import { Input, Button } from "@/components/admin/ui";
import { XIcon, LockIcon, CheckIcon } from "@/components/admin/icons";

const initialState: ChangePasswordState = {};

// The form (and its useActionState) live in this child, mounted only
// while the dialog is open — so every reopen gets a fresh
// useActionState instead of showing the previous "Password updated"
// success screen again.
function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div
      className="font-admin fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        className="w-full max-w-sm rounded-t-2xl bg-white p-6 text-left shadow-xl sm:rounded-2xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <LockIcon className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon />
          </button>
        </div>

        {state.success ? (
          <>
            <div className="mb-5 flex items-start gap-2 rounded-lg bg-green-50 px-3.5 py-3 text-sm text-green-800">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
              Password updated. Use it next time you log in.
            </div>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full">
              Done
            </Button>
          </>
        ) : (
          <form ref={formRef} action={formAction} className="flex flex-col gap-3">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              required
              autoComplete="current-password"
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New password"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              minLength={6}
              autoComplete="new-password"
            />

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <div className="mt-1 flex gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// "Change password" in the admin sidebar — lets the studio update their
// own login password without calling a developer.
export function ChangePasswordButton({ className }: { className?: string } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "font-medium text-white/70 transition hover:text-white"}
      >
        Change password
      </button>

      {open && <ChangePasswordDialog onClose={() => setOpen(false)} />}
    </>
  );
}
