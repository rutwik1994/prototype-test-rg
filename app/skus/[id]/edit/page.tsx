import { notFound } from "next/navigation";
import { SkuForm } from "@/components/skus/sku-form";
import { getSku } from "@/lib/actions";

export default async function EditSkuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sku = await getSku(parseInt(id));

  if (!sku) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Edit SKU</h1>
      <SkuForm sku={sku} />
    </main>
  );
}
