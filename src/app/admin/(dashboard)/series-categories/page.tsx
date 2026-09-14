import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Card, Input, Button } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { renameCategory, deleteCategory } from "./actions";
import { AddCategoryForm } from "./AddCategoryForm";

export const dynamic = "force-dynamic";

export default async function SeriesCategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from("product_categories")
    .select("id,name")
    .order("sort_order");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Series Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          The product types listed under Products — e.g. Wall Clock, Pendant Lights. Every product needs one.
        </p>
      </div>

      <AddCategoryForm />

      <Card className="mt-6 divide-y divide-gray-100">
        {(categories ?? []).map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <form action={renameCategory.bind(null, c.id)} className="flex flex-1 items-center gap-2">
              <Input name="name" defaultValue={c.name} className="flex-1" required />
              <Button type="submit" variant="secondary" className="shrink-0 px-3.5 py-2 text-sm">
                Save
              </Button>
            </form>
            <DeleteButton
              action={deleteCategory.bind(null, c.id)}
              confirmText={`Delete "${c.name}"? Products using it will need a different category first.`}
            />
          </div>
        ))}
        {(categories ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">No categories yet.</p>
        )}
      </Card>
    </div>
  );
}
