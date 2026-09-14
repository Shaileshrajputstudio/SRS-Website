"use client";

import { useActionState, useEffect, useRef } from "react";
import { addCategory, type CategoryFormState } from "./actions";
import { Input, Button, Card } from "@/components/admin/ui";
import { PlusIcon } from "@/components/admin/icons";

const initialState: CategoryFormState = {};

export function AddCategoryForm() {
  const [state, formAction, isPending] = useActionState(addCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  return (
    <Card className="p-4">
      <form ref={formRef} action={formAction} className="flex items-center gap-3">
        <Input name="name" placeholder="e.g. Wall Clock" className="flex-1" required />
        <Button type="submit" disabled={isPending} className="shrink-0 px-3.5 py-2 text-sm">
          <PlusIcon />
          {isPending ? "Adding…" : "Add category"}
        </Button>
      </form>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </Card>
  );
}
