"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePress, type PressFormState } from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Input, Textarea, Select, Label, Button, LinkButton, Card } from "@/components/admin/ui";
import { ArrowLeftIcon } from "@/components/admin/icons";

const initialState: PressFormState = {};

export type PressCategory = "Exhibition" | "Press";

export type PressRecord = {
  id: string;
  title: string;
  venue: string;
  city: string;
  year: string;
  status: "Upcoming" | "Past";
  category: PressCategory;
  placeholder: boolean;
  description: string;
  url: string | null;
  image_url: string | null;
  logo_url: string | null;
  images: string[];
};

const SECTION = {
  Exhibition: { label: "Exhibitions", basePath: "/admin/exhibitions" },
  Press: { label: "Press", basePath: "/admin/press" },
} as const;

export function PressForm({
  entry,
  category,
}: {
  entry?: PressRecord;
  category: PressCategory;
}) {
  const [state, formAction, isPending] = useActionState(savePress, initialState);
  const [imageUrl, setImageUrl] = useState(entry?.image_url ?? "");
  const [logoUrl, setLogoUrl] = useState(entry?.logo_url ?? "");
  const section = SECTION[category];

  return (
    <div className="max-w-2xl">
      <Link
        href={section.basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeftIcon />
        {section.label}
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {entry ? `Edit ${entry.title}` : `Add ${category === "Exhibition" ? "an exhibition" : "a press entry"}`}
      </h1>

      <form action={formAction} className="space-y-6">
        {entry && <input type="hidden" name="id" value={entry.id} />}
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {category === "Press" && <input type="hidden" name="logoUrl" value={logoUrl} />}

        <Card className="space-y-4 p-6">
          <div className={`grid grid-cols-1 gap-4 ${category === "Exhibition" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            <div>
              <Label htmlFor="venue">Venue / publication</Label>
              <Input id="venue" name="venue" defaultValue={entry?.venue} />
            </div>
            {category === "Exhibition" && (
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue={entry?.city} />
              </div>
            )}
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" defaultValue={entry?.year} />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={entry?.status ?? "Upcoming"}>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={entry?.title} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={entry?.description} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="placeholder" defaultChecked={entry?.placeholder} className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400" />
            Placeholder (details/venue not confirmed yet)
          </label>

          {category === "Press" && (
            <div>
              <Label htmlFor="url">Article URL <span className="text-gray-400">(optional)</span></Label>
              <Input id="url" name="url" defaultValue={entry?.url ?? ""} placeholder="https://…" />
            </div>
          )}
        </Card>

        <Card className="space-y-6 p-6">
          <ImageUploader
            folder="press"
            initialImages={imageUrl ? [imageUrl] : []}
            label="Thumbnail photo"
            single
            onChange={(urls) => setImageUrl(urls[0] ?? "")}
          />

          {category === "Press" && (
            <ImageUploader
              folder="press"
              initialImages={logoUrl ? [logoUrl] : []}
              label="Publication logo (shown instead of the photo)"
              single
              onChange={(urls) => setLogoUrl(urls[0] ?? "")}
            />
          )}

          {category === "Exhibition" && (
            <ImageUploader
              name="images"
              folder="press"
              initialImages={entry?.images ?? []}
              label="Gallery photos (powers the click-through photo gallery)"
            />
          )}
        </Card>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3">
          <LinkButton href={section.basePath} variant="secondary">Cancel</LinkButton>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save entry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
