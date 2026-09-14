"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveCollection, type CollectionFormState } from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FilmListEditor, type FilmRow } from "@/components/admin/FilmListEditor";
import { ElementEditor, type ElementData } from "./ElementEditor";
import { Input, Textarea, Label, Button, LinkButton, Card } from "@/components/admin/ui";
import { ArrowLeftIcon } from "@/components/admin/icons";

const initialState: CollectionFormState = {};

export type CollectionRecord = {
  id: string;
  slug: string;
  title: string;
  sanskrit_name: string;
  cover_url: string | null;
  myth: string;
  material_story: string;
  films: FilmRow[];
  elements?: ElementData[];
};

export function CollectionForm({ collection }: { collection?: CollectionRecord }) {
  const [state, formAction, isPending] = useActionState(saveCollection, initialState);
  const [coverUrl, setCoverUrl] = useState(collection?.cover_url ?? "");
  const [elements, setElements] = useState<ElementData[]>(collection?.elements ?? []);

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/collections"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeftIcon />
        Story Categories
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {collection ? `Edit ${collection.title}` : "Add a story"}
      </h1>

      <form action={formAction} className="space-y-6">
        {collection && <input type="hidden" name="id" value={collection.id} />}
        <input type="hidden" name="coverUrl" value={coverUrl} />
        {collection?.elements && (
          <input type="hidden" name="elementsJson" value={JSON.stringify(elements)} />
        )}

        <Card className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={collection?.title} placeholder="e.g. Kabir's Dohas" required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (used in the URL)</Label>
              <Input id="slug" name="slug" defaultValue={collection?.slug} placeholder="e.g. kabir-ke-dohe" required />
            </div>
          </div>

          <div>
            <Label htmlFor="sanskritName">Sanskrit name</Label>
            <Input id="sanskritName" name="sanskritName" defaultValue={collection?.sanskrit_name} />
          </div>

          <div>
            <Label htmlFor="myth">Myth</Label>
            <Textarea id="myth" name="myth" rows={4} defaultValue={collection?.myth} />
          </div>

          <div>
            <Label htmlFor="materialStory">Material story</Label>
            <Textarea id="materialStory" name="materialStory" rows={3} defaultValue={collection?.material_story} />
          </div>

          <ImageUploader
            folder="collections"
            initialImages={coverUrl ? [coverUrl] : []}
            label="Cover photo"
            single
            onChange={(urls) => setCoverUrl(urls[0] ?? "")}
          />
        </Card>

        <div>
          <Label>Films</Label>
          <FilmListEditor name="filmsJson" folder="films" initial={collection?.films ?? []} />
        </div>

        {collection?.elements && (
          <div>
            <p className="mb-3 text-xs font-medium tracking-wide text-gray-400 uppercase">The six elements</p>
            <div className="space-y-4">
              {elements.map((el, i) => (
                <ElementEditor
                  key={el.id}
                  element={el}
                  onChange={(updated) =>
                    setElements((prev) => prev.map((e, idx) => (idx === i ? updated : e)))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3">
          <LinkButton href="/admin/collections" variant="secondary">Cancel</LinkButton>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save collection"}
          </Button>
        </div>
      </form>
    </div>
  );
}
