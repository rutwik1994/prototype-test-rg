import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SkuTable } from "@/components/skus/sku-table";
import { getSkus } from "@/lib/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SkusPage() {
  const skus = await getSkus();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Culinary SKUs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {skus.length} SKU{skus.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/skus/new" className={cn(buttonVariants())}>
          + New SKU
        </Link>
      </div>
      <SkuTable skus={skus} />
    </main>
  );
}
