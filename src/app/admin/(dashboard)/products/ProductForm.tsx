"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProduct, type ProductFormState } from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Input, Textarea, Select, Label, Button, LinkButton, Card } from "@/components/admin/ui";
import { ArrowLeftIcon } from "@/components/admin/icons";

const initialState: ProductFormState = {};

export type ProductRecord = {
  id: string;
  slug: string;
  display_name: string;
  romanized: string;
  series: string;
  category: string;
  placeholder: boolean;
  about: string[];
  closing: string[];
  product_code: string;
  material: string;
  dim_height: string;
  dim_width: string;
  dim_depth: string;
  weight: string;
  lead_time: string;
  images: string[];
};

export function ProductForm({
  product,
  categories,
  stories,
}: {
  product?: ProductRecord;
  categories: string[];
  stories: string[];
}) {
  const [state, formAction, isPending] = useActionState(saveProduct, initialState);
  const currentStory = product?.series && stories.includes(product.series) ? product.series : "—";

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeftIcon />
        Products
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {product ? `Edit ${product.display_name}` : "Add a product"}
      </h1>

      <form action={formAction} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}

        <Card className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={product?.display_name}
                placeholder="e.g. MAR:GA"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (used in the URL)</Label>
              <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="e.g. marga" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="romanized">Romanized name</Label>
              <Input id="romanized" name="romanized" defaultValue={product?.romanized} />
            </div>
            <div>
              <Label htmlFor="series">Story <span className="text-gray-400">(optional)</span></Label>
              <Select id="series" name="series" defaultValue={currentStory}>
                <option value="—">No story</option>
                {stories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Series <span className="text-gray-400">(the product type, e.g. Wall Clock)</span></Label>
            <Select id="category" name="category" defaultValue={product?.category} required>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="placeholder" defaultChecked={product?.placeholder} className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400" />
            Placeholder (not real product photography/details yet)
          </label>
        </Card>

        <Card className="space-y-6 p-6">
          <div>
            <Label htmlFor="about">About (one paragraph per line)</Label>
            <Textarea id="about" name="about" rows={4} defaultValue={product?.about.join("\n")} />
          </div>

          <div>
            <Label htmlFor="closing">Closing lines (optional, one per line)</Label>
            <Textarea id="closing" name="closing" rows={2} defaultValue={product?.closing.join("\n")} />
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="productCode">Product code</Label>
              <Input id="productCode" name="productCode" defaultValue={product?.product_code} />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Input id="material" name="material" defaultValue={product?.material} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="dimHeight">Height</Label>
              <Input id="dimHeight" name="dimHeight" defaultValue={product?.dim_height} />
            </div>
            <div>
              <Label htmlFor="dimWidth">Width</Label>
              <Input id="dimWidth" name="dimWidth" defaultValue={product?.dim_width} />
            </div>
            <div>
              <Label htmlFor="dimDepth">Depth</Label>
              <Input id="dimDepth" name="dimDepth" defaultValue={product?.dim_depth} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" name="weight" defaultValue={product?.weight} />
            </div>
            <div>
              <Label htmlFor="leadTime">Lead time</Label>
              <Input id="leadTime" name="leadTime" defaultValue={product?.lead_time} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <ImageUploader name="images" folder="products" initialImages={product?.images ?? []} />
        </Card>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3">
          <LinkButton href="/admin/products" variant="secondary">Cancel</LinkButton>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
