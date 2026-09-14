"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FilmListEditor, type FilmRow } from "@/components/admin/FilmListEditor";
import { Input, Textarea, Label, Card } from "@/components/admin/ui";

export type ElementData = {
  id: string;
  slug: string;
  title: string;
  sanskrit_name: string;
  element: string;
  cover_url: string;
  myth: string;
  material_story: string;
  films: FilmRow[];
};

// Panch Bhuta's six elemental sub-chapters are structurally fixed (the
// site's own content model doesn't support adding/removing one — see
// collections.ts), so this only ever edits an existing element in place,
// never adds or deletes one.
export function ElementEditor({
  element,
  onChange,
}: {
  element: ElementData;
  onChange: (element: ElementData) => void;
}) {
  const [data, setData] = useState(element);

  useEffect(() => {
    onChange(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function patch(p: Partial<ElementData>) {
    setData((prev) => ({ ...prev, ...p }));
  }

  return (
    <Card className="p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
        {data.title}
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500">{data.element}</span>
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Title</Label>
            <Input value={data.title} onChange={(e) => patch({ title: e.target.value })} />
          </div>
          <div>
            <Label>Sanskrit name</Label>
            <Input value={data.sanskrit_name} onChange={(e) => patch({ sanskrit_name: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Myth</Label>
          <Textarea rows={3} value={data.myth} onChange={(e) => patch({ myth: e.target.value })} />
        </div>

        <div>
          <Label>Material story</Label>
          <Textarea rows={2} value={data.material_story} onChange={(e) => patch({ material_story: e.target.value })} />
        </div>

        <ImageUploader
          folder="collections"
          initialImages={data.cover_url ? [data.cover_url] : []}
          label="Cover photo"
          single
          onChange={(urls) => patch({ cover_url: urls[0] ?? "" })}
        />

        <div>
          <Label>Films</Label>
          <FilmListEditor folder="films" initial={data.films} onChange={(films) => patch({ films })} />
        </div>
      </div>
    </Card>
  );
}
