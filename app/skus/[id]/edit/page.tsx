import { notFound } from "next/navigation";
import { SageHeader } from "@/components/sage/Header";
import { SkuForm } from "@/components/skus/sku-form";
import { getSku } from "@/lib/actions";

export default async function EditSkuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sku = await getSku(parseInt(id));

  if (!sku) notFound();

  return (
    <div style={{ flex: 1 }}>
      <SageHeader
        breadcrumbs={["Production Planning", "Supply Planning", "Edit SKU"]}
        title={sku.name}
      />
      <div style={{ padding: '32px' }}>
        <SkuForm sku={sku} />
      </div>
    </div>
  );
}
