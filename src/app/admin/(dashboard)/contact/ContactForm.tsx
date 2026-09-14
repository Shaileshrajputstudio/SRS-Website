"use client";

import { useActionState } from "react";
import { saveContactInfo, type ContactFormState } from "./actions";
import type { StudioContactInfo } from "@/data/studioInfo";
import { Input, Textarea, Label, Button, Card } from "@/components/admin/ui";

const initialState: ContactFormState = {};

export function ContactForm({ info }: { info: StudioContactInfo }) {
  const [state, formAction, isPending] = useActionState(saveContactInfo, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Card className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone <span className="text-gray-400">(e.g. +919967788543)</span></Label>
            <Input id="phone" name="phone" defaultValue={info.phone} />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp number <span className="text-gray-400">(no + or spaces)</span></Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={info.whatsapp} />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={info.email} />
        </div>

        <div>
          <Label htmlFor="address">Studio address (one line per line)</Label>
          <Textarea id="address" name="address" rows={3} defaultValue={info.addressLines.join("\n")} />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="instagram">Instagram profile URL</Label>
            <Input id="instagram" name="instagram" defaultValue={info.instagram} />
          </div>
          <div>
            <Label htmlFor="instagramDm">Instagram DM link</Label>
            <Input id="instagramDm" name="instagramDm" defaultValue={info.instagramDm} />
          </div>
        </div>

        <div>
          <Label htmlFor="facebook">Facebook page URL</Label>
          <Input id="facebook" name="facebook" defaultValue={info.facebook} />
        </div>
      </Card>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-700">Saved.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save contact info"}
      </Button>
    </form>
  );
}
