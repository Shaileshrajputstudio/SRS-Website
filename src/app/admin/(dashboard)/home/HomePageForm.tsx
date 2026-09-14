"use client";

import { useActionState } from "react";
import { saveHomePage, type HomePageFormState } from "./actions";
import { FeaturedProductsPicker } from "./FeaturedProductsPicker";
import { Input, Textarea, Label, Button, Card } from "@/components/admin/ui";

const initialState: HomePageFormState = {};

export function HomePageForm({
  content,
  allProducts,
}: {
  content: { heroVideoUrl: string; heroEyebrow: string; heroHeadline: string; featuredProductSlugs: string[] };
  allProducts: { slug: string; displayName: string }[];
}) {
  const [state, formAction, isPending] = useActionState(saveHomePage, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Card className="space-y-4 p-6">
        <p className="mb-1 text-xs font-medium tracking-wide text-gray-400 uppercase">Hero</p>
        <div>
          <Label htmlFor="heroVideoUrl">Hero video (path or URL)</Label>
          <Input
            id="heroVideoUrl"
            name="heroVideoUrl"
            defaultValue={content.heroVideoUrl}
            placeholder="/videos/arrival-hero.mp4"
          />
        </div>
        <div>
          <Label htmlFor="heroEyebrow">Eyebrow text (small line above the headline)</Label>
          <Input id="heroEyebrow" name="heroEyebrow" defaultValue={content.heroEyebrow} />
        </div>
        <div>
          <Label htmlFor="heroHeadline">Headline</Label>
          <Textarea id="heroHeadline" name="heroHeadline" rows={2} defaultValue={content.heroHeadline} />
        </div>
      </Card>

      <Card className="p-6">
        <p className="mb-1 text-xs font-medium tracking-wide text-gray-400 uppercase">Featured Products</p>
        <p className="mb-4 text-xs text-gray-400">Shown in order on the homepage carousel.</p>
        <FeaturedProductsPicker allProducts={allProducts} initialSlugs={content.featuredProductSlugs} />
      </Card>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-700">Saved.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save home page"}
      </Button>
    </form>
  );
}
