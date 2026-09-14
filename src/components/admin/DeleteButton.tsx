"use client";

import { useEffect, useState, useTransition } from "react";
import { TrashIcon, XIcon } from "./icons";
import { Button } from "./ui";

function ConfirmDeleteDialog({
  confirmText,
  isPending,
  error,
  onCancel,
  onConfirm,
}: {
  confirmText: string;
  isPending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  return (
    <div
      className="font-admin fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        className="w-full max-w-sm rounded-t-2xl bg-white p-6 text-left shadow-xl sm:rounded-2xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TrashIcon className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Delete this?</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon />
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-500">{confirmText}</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending} className="flex-1">
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={isPending} className="flex-1">
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeleteButton({
  action,
  confirmText,
  className,
}: {
  action: () => Promise<void>;
  confirmText: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        }
      >
        <TrashIcon className="h-4 w-4" />
        Delete
      </button>

      {open && (
        <ConfirmDeleteDialog
          confirmText={confirmText}
          isPending={isPending}
          error={error}
          onCancel={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
