import { SkuTable } from "@/components/skus/sku-table";

const MOCK_SKUS = [
  { id: 1, name: "Chicken Breast 250g", category: "Protein", unitOfMeasure: "kg", costPerUnit: 4.5, status: "Active", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Baby Spinach", category: "Vegetable", unitOfMeasure: "g", costPerUnit: 0.02, status: "Active", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Basmati Rice", category: "Grain", unitOfMeasure: "kg", costPerUnit: 2.1, status: "Active", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Greek Yogurt", category: "Dairy", unitOfMeasure: "L", costPerUnit: 3.8, status: "Inactive", createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Pesto Sauce", category: "Sauce", unitOfMeasure: "unit", costPerUnit: 1.95, status: "Active", createdAt: new Date(), updatedAt: new Date() },
];

export default async function SkusPage() {
  const skus = MOCK_SKUS;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Culinary SKUs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {skus.length} SKU{skus.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>
      <SkuTable skus={skus} />
    </main>
  );
}
