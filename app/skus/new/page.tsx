import { SkuForm } from "@/components/skus/sku-form";

export default function NewSkuPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">New Culinary SKU</h1>
      <SkuForm />
    </main>
  );
}
