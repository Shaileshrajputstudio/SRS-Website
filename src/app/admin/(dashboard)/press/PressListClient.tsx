"use client";

import Link from "next/link";
import { deletePress } from "./actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Card, Badge } from "@/components/admin/ui";
import { ImageIcon } from "@/components/admin/icons";

type Row = {
  id: string;
  title: string;
  venue: string;
  status: string;
  placeholder: boolean;
  image_url: string | null;
  logo_url: string | null;
};

export function PressListClient({
  entries,
  editBasePath,
  emptyText = "No entries yet.",
}: {
  entries: Row[];
  editBasePath: string;
  emptyText?: string;
}) {
  return (
    <Card className="divide-y divide-gray-100">
      {entries.map((e) => {
        const thumb = e.logo_url ?? e.image_url;
        return (
          <div key={e.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-sm font-medium text-gray-900">
                {e.title}
                {e.placeholder && <Badge>Placeholder</Badge>}
              </p>
              <p className="truncate text-xs text-gray-400">
                {e.status} · {e.venue}
              </p>
            </div>
            <Link
              href={`${editBasePath}/${e.id}`}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Edit
            </Link>
            <DeleteButton
              action={deletePress.bind(null, e.id)}
              confirmText={`Delete "${e.title}"? This can't be undone.`}
            />
          </div>
        );
      })}
      {entries.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">{emptyText}</p>
      )}
    </Card>
  );
}
