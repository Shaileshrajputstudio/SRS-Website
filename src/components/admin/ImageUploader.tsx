"use client";

import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { supabaseClient } from "@/lib/supabaseClient";
import { createImageUploadUrl } from "@/app/admin/uploadActions";
import { UploadCloudIcon, XIcon } from "./icons";
import { Label } from "./ui";

// Real camera/phone photos routinely run 5-15MB each — at that size, a
// handful of product uploads would eat a meaningful slice of Supabase
// Storage's 1GB free tier. Compressing client-side before upload (resize
// to a sane web dimension + recompress) keeps storage use low and pages
// fast, without the studio ever having to think about file size.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    return await imageCompression(file, {
      maxSizeMB: 3,
      maxWidthOrHeight: 2400,
      useWebWorker: true,
      fileType: file.type,
    });
  } catch {
    // If compression fails for any reason, upload the original rather
    // than blocking the studio from adding the photo at all.
    return file;
  }
}

// Shared image manager for every admin edit form (products, collections,
// press, films). Renders the current images as removable thumbnails plus
// a drag-and-drop dropzone; new files upload straight to Supabase Storage
// from the browser (see uploadActions.ts for why), and the resulting
// public URLs are added to the list.
//
// Two ways a parent reads the result: pass `name` to have the list
// submitted as hidden inputs (one per image) for a plain <form> server
// action to read via formData.getAll(name) — used by top-level fields
// like a product's photos. Pass `onChange` instead when the value needs
// to be captured into the parent's own state (e.g. a film's poster,
// nested inside FilmListEditor's JSON blob) rather than as its own form
// field; `name` can be omitted in that case.
export function ImageUploader({
  name,
  folder,
  initialImages,
  label = "Photos",
  single = false,
  onChange,
}: {
  name?: string;
  folder: string;
  initialImages: string[];
  label?: string;
  single?: boolean;
  onChange?: (images: string[]) => void;
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange?.(images);
    // Only fire when the images list itself changes, not on every parent
    // render — onChange is expected to be a stable-enough closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file);
        const { path, token, publicUrl } = await createImageUploadUrl(folder, file.name);
        const { error: uploadError } = await supabaseClient.storage
          .from("media")
          .uploadToSignedUrl(path, token, compressed);
        if (uploadError) throw uploadError;
        uploaded.push(publicUrl);
      }
      setImages((prev) => (single ? uploaded.slice(-1) : [...prev, ...uploaded]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  const showDropzone = !single || images.length === 0;

  return (
    <div>
      <Label>{label}</Label>

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              {name && <input type="hidden" name={name} value={url} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black"
                aria-label="Remove photo"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showDropzone && (
        <>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-6 py-6 text-center transition ${
              dragOver
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <UploadCloudIcon className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to ~10MB — compressed automatically</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple={!single}
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </label>
          {uploading && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Uploading…
            </p>
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
