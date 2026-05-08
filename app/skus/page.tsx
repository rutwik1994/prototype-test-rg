import Link from "next/link";
import { SageHeader } from "@/components/sage/Header";
import { SageSkuTable } from "@/components/sage/SkuTable";
import { Button } from "@/components/sage/primitives";
import { IconPlus } from "@/components/sage/icons";
import { getSkus, deleteSku, deleteSkus } from "@/lib/actions";

export const dynamic = "force-dynamic";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function MetricCard({ label, value, sub, accent = '#067A46' }: MetricCardProps) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E4E4', borderRadius: 8,
      padding: '20px 24px', flex: 1, minWidth: 0,
      boxShadow: '0 1px 3px rgba(36,36,36,.06)',
    }}>
      <div style={{ font: '600 11px/16px var(--font-body)', textTransform: 'uppercase', letterSpacing: '.06em', color: '#676767', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ font: '500 28px/36px var(--font-display)', color: '#242424' }}>
        {value}
      </div>
      {sub && (
        <div style={{ font: '400 12px/16px var(--font-body)', color: accent, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default async function SkusPage() {
  const skus = await getSkus();

  const total     = skus.length;
  const active    = skus.filter(s => s.status === 'Active').length;
  const inactive  = total - active;
  const avgCost   = total > 0 ? skus.reduce((s, r) => s + r.costPerUnit, 0) / total : 0;
  const categories = new Set(skus.map(s => s.category)).size;
  const pctActive = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div style={{ flex: 1 }}>
      <SageHeader
        breadcrumbs={["Production Planning", "Supply Planning"]}
        title="Culinary SKUs"
        subtitle={`${total} SKU${total !== 1 ? "s" : ""} total`}
        primaryAction={
          <Link href="/skus/new" style={{ textDecoration: 'none' }}>
            <Button variant="fill" color="positive" size="md" leadingIcon={<IconPlus size={16} />}>
              New SKU
            </Button>
          </Link>
        }
      />

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: 16, padding: '24px 32px 0' }}>
        <MetricCard
          label="Total SKUs"
          value={String(total)}
          sub={`${categories} categor${categories !== 1 ? 'ies' : 'y'}`}
        />
        <MetricCard
          label="Active"
          value={String(active)}
          sub={`${pctActive}% of total`}
          accent="#067A46"
        />
        <MetricCard
          label="Inactive"
          value={String(inactive)}
          sub={inactive > 0 ? `${100 - pctActive}% of total` : 'All SKUs active'}
          accent={inactive > 0 ? '#B30000' : '#067A46'}
        />
        <MetricCard
          label="Avg. Cost per Unit"
          value={`€${avgCost.toFixed(2)}`}
          sub={`across ${total} SKU${total !== 1 ? 's' : ''}`}
        />
      </div>

      {/* Table */}
      <div style={{ padding: '16px 32px 32px' }}>
        <div style={{ background: '#fff', border: '1px solid #E4E4E4', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 4px rgba(36,36,36,.06)' }}>
          <SageSkuTable skus={skus} onDelete={deleteSku} onDeleteMany={deleteSkus} />
        </div>
      </div>
    </div>
  );
}
