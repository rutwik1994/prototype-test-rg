import Link from "next/link";
import { SageHeader } from "@/components/sage/Header";
import { SageSkuTable } from "@/components/sage/SkuTable";
import { Button } from "@/components/sage/primitives";
import { IconPlus } from "@/components/sage/icons";
import { getSkus, deleteSku } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SkusPage() {
  const skus = await getSkus();

  return (
    <div style={{ flex: 1 }}>
      <SageHeader
        breadcrumbs={["Production Planning", "Kitting Planning"]}
        title="Culinary SKUs"
        subtitle={`${skus.length} SKU${skus.length !== 1 ? "s" : ""} total`}
        primaryAction={
          <Link href="/skus/new" style={{ textDecoration: 'none' }}>
            <Button
              variant="fill"
              color="positive"
              size="md"
              leadingIcon={<IconPlus size={16} />}
            >
              New SKU
            </Button>
          </Link>
        }
      />
      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: '#fff', border: '1px solid #E4E4E4', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 4px rgba(36,36,36,.06)' }}>
          <SageSkuTable skus={skus} onDelete={deleteSku} />
        </div>
      </div>
    </div>
  );
}
