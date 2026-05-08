import { SageHeader } from "@/components/sage/Header";
import { SkuForm } from "@/components/skus/sku-form";

export default function NewSkuPage() {
  return (
    <div style={{ flex: 1 }}>
      <SageHeader
        breadcrumbs={["Production Planning", "Supply Planning", "New SKU"]}
        title="New SKU"
      />
      <div style={{ padding: '32px' }}>
        <SkuForm />
      </div>
    </div>
  );
}
