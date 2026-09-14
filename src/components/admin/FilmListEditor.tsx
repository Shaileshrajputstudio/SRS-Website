"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { Input, Select, Card, Button } from "./ui";
import { TrashIcon, PlusIcon } from "./icons";

export type FilmRow = {
  slug: string;
  title: string;
  duration: string;
  type: "Brand Film" | "Process Film" | "Collection Film";
  video_url: string;
  poster_url: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// A dynamic add/remove list of films, used both for a collection's own
// films and (for Panch Bhuta) each element's films. The final list is
// serialized to JSON into one hidden input so the parent <form>'s server
// action can read + diff it against what's in the database.
export function FilmListEditor({
  name,
  folder,
  initial,
  onChange,
}: {
  name?: string;
  folder: string;
  initial: FilmRow[];
  onChange?: (films: FilmRow[]) => void;
}) {
  const [films, setFilms] = useState<FilmRow[]>(initial);

  useEffect(() => {
    onChange?.(films);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [films]);

  function update(index: number, patch: Partial<FilmRow>) {
    setFilms((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function addFilm() {
    setFilms((prev) => [
      ...prev,
      { slug: "", title: "", duration: "", type: "Collection Film", video_url: "", poster_url: "" },
    ]);
  }

  function removeFilm(index: number) {
    setFilms((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      {name && <input type="hidden" name={name} value={JSON.stringify(films)} />}
      <div className="space-y-3">
        {films.map((film, i) => (
          <Card key={i} className="p-4">
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                placeholder="Title"
                value={film.title}
                onChange={(e) => {
                  const title = e.target.value;
                  update(i, { title, slug: film.slug || slugify(title) });
                }}
              />
              <Input
                placeholder="Duration e.g. 2:14"
                value={film.duration}
                onChange={(e) => update(i, { duration: e.target.value })}
              />
            </div>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Select
                value={film.type}
                onChange={(e) => update(i, { type: e.target.value as FilmRow["type"] })}
              >
                <option value="Brand Film">Brand Film</option>
                <option value="Process Film">Process Film</option>
                <option value="Collection Film">Collection Film</option>
              </Select>
              <Input
                placeholder="Video URL (path or link)"
                value={film.video_url}
                onChange={(e) => update(i, { video_url: e.target.value })}
              />
            </div>
            <ImageUploader
              folder={folder}
              initialImages={film.poster_url ? [film.poster_url] : []}
              label="Poster"
              single
              onChange={(urls) => update(i, { poster_url: urls[0] ?? "" })}
            />
            <button
              type="button"
              onClick={() => removeFilm(i)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-600"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Remove this film
            </button>
          </Card>
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={addFilm} className="mt-3 px-2.5 py-1.5 text-xs">
        <PlusIcon />
        Add film
      </Button>
    </div>
  );
}
