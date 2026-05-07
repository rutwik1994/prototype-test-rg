import Link from "next/link";
import { SkuTable } from "@/components/skus/sku-table";
import { getSkus } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SkusPage() {
  const skus = await getSkus();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Culinary SKUs</h1>
            <p className="text-gray-500 text-sm mt-1">
              {skus.length} SKU{skus.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/skus/new"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New SKU
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <SkuTable skus={skus} />
        </div>
      </main>
    </div>
  );
}
