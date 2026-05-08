"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Sku } from "@/app/generated/prisma/client";
import { Icon, IconEdit, IconTrash, IconSort, IconSearch, CheckBox, type IconName } from "./icons";
import { Button } from "./primitives";

type SortKey = 'name' | 'category' | 'unitOfMeasure' | 'costPerUnit' | 'status';
type SortDir = 'asc' | 'desc';

const CATEGORY_ICON: Record<string, { icon: IconName; color: string; bg: string }> = {
  Protein:   { icon: 'cloche', color: '#067A46', bg: '#F6FDE9' },
  Vegetable: { icon: 'apple',  color: '#00A846', bg: '#E4FABF' },
  Grain:     { icon: 'book',   color: '#A97739', bg: '#F8EDCD' },
  Dairy:     { icon: 'box',    color: '#1268FF', bg: '#E9FAFF' },
  Sauce:     { icon: 'recipe', color: '#EF670A', bg: '#FFECD3' },
  Other:     { icon: 'inv',    color: '#676767', bg: '#EEEEEE' },
};

const STATUS_PILL: Record<string, { bg: string; fg: string; dot: string; label: string }> = {
  Active:   { bg: '#F6FDE9', fg: '#067A46', dot: '#067A46', label: 'Active' },
  Inactive: { bg: '#FFEAE9', fg: '#B30000', dot: '#DB1D1D', label: 'Inactive' },
};

function StatusPill({ status }: { status: string }) {
  const m = STATUS_PILL[status] ?? { bg: '#EEEEEE', fg: '#4B4B4B', dot: '#676767', label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      font: '600 12px/16px var(--font-body)', padding: '2px 10px', borderRadius: 336,
      background: m.bg, color: m.fg,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot }} />
      {m.label}
    </span>
  );
}

function CategoryAvatar({ category }: { category: string }) {
  const meta = CATEGORY_ICON[category] ?? { icon: 'inv' as IconName, color: '#676767', bg: '#EEEEEE' };
  return (
    <span style={{
      width: 32, height: 32, flexShrink: 0, borderRadius: 6,
      background: meta.bg, color: meta.color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={meta.icon} size={18} />
    </span>
  );
}

const iconBtnBase: React.CSSProperties = {
  width: 32, height: 32, padding: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid transparent', borderRadius: 4, cursor: 'pointer',
  background: 'transparent', transition: 'all 150ms var(--ease-out)',
};

interface Props {
  skus: Sku[];
  onDelete: (id: number) => Promise<void>;
}

export function SageSkuTable({ skus, onDelete }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey | null; dir: SortDir }>({ key: null, dir: 'asc' });
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverEdit, setHoverEdit] = useState<number | null>(null);
  const [hoverDelete, setHoverDelete] = useState<number | null>(null);

  const categories = Array.from(new Set(skus.map(s => s.category))).sort();
  const statuses = Array.from(new Set(skus.map(s => s.status))).sort();

  let rows = skus.filter(r => {
    if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  if (sort.key) {
    const key = sort.key;
    const dir = sort.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map(r => r.id)));
  };
  const toggleRow = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await onDelete(id);
    });
  };

  const HeaderCell = ({ label, sortKey, align = 'left' }: { label: string; sortKey: SortKey; align?: 'left' | 'right' }) => {
    const active = sort.key === sortKey;
    return (
      <th onClick={() => handleSort(sortKey)} style={{
        padding: '12px 16px', textAlign: align, cursor: 'pointer',
        font: '600 12px/16px var(--font-body)', textTransform: 'uppercase', letterSpacing: '.06em',
        color: active ? '#242424' : '#676767', userSelect: 'none', whiteSpace: 'nowrap',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: align === 'right' ? 'flex-end' : 'flex-start', width: '100%' }}>
          {label}
          <IconSort dir={active ? sort.dir : null} />
        </span>
      </th>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EEEEEE', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', gap: 8,
          border: '1px solid #E4E4E4', borderRadius: 4, background: '#fff', flex: '1 1 200px', maxWidth: 320,
        }}>
          <span style={{ color: '#676767', display: 'inline-flex' }}><IconSearch size={14} /></span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search SKUs…"
            style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', font: '400 14px/20px var(--font-body)', color: '#242424' }}
          />
        </div>

        {categories.length > 1 && (
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{
            height: 36, padding: '0 10px', border: '1px solid #E4E4E4', borderRadius: 4,
            font: '400 13px/20px var(--font-body)', color: '#242424', background: '#fff', cursor: 'pointer',
          }}>
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {statuses.length > 1 && (
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
            height: 36, padding: '0 10px', border: '1px solid #E4E4E4', borderRadius: 4,
            font: '400 13px/20px var(--font-body)', color: '#242424', background: '#fff', cursor: 'pointer',
          }}>
            <option value="all">All statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
          background: '#F6FDE9', borderBottom: '1px solid #D2F895',
        }}>
          <span style={{ font: '600 13px/16px var(--font-body)', color: '#067A46' }}>{selected.size} selected</span>
          <div style={{ flex: 1 }} />
          <Button variant="text" size="sm" color="negative" onClick={() => setSelected(new Set())}>Clear selection</Button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', font: '400 14px/20px var(--font-body)' }}>
          <thead>
            <tr style={{ background: '#F8F8F8', borderBottom: '1px solid #E4E4E4' }}>
              <th style={{ padding: '12px 16px', width: 40 }}>
                <CheckBox checked={allSelected} onChange={toggleAll} />
              </th>
              <HeaderCell label="Name" sortKey="name" />
              <HeaderCell label="Category" sortKey="category" />
              <HeaderCell label="Unit of measure" sortKey="unitOfMeasure" />
              <HeaderCell label="Cost per unit" sortKey="costPerUnit" align="right" />
              <HeaderCell label="Status" sortKey="status" />
              <th style={{ padding: '12px 16px', width: 100, textAlign: 'right',
                font: '600 12px/16px var(--font-body)', textTransform: 'uppercase', letterSpacing: '.06em', color: '#676767' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const sel = selected.has(r.id);
              const hov = hoverRow === r.id;
              return (
                <tr key={r.id}
                  onMouseEnter={() => setHoverRow(r.id)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={{
                    borderBottom: '1px solid #EEEEEE',
                    background: sel ? '#F6FDE9' : (hov ? '#F8F8F8' : '#fff'),
                    transition: 'background 150ms var(--ease-out)',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <CheckBox checked={sel} onChange={() => toggleRow(r.id)} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CategoryAvatar category={r.category} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: '600 14px/20px var(--font-body)', color: '#242424' }}>{r.name}</div>
                        <div style={{ font: '400 12px/16px var(--font-body)', color: '#676767', fontFamily: 'var(--font-mono)' }}>
                          SKU-{String(r.id).padStart(4, '0')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px',
                      background: '#EEEEEE', borderRadius: 336,
                      font: '600 12px/18px var(--font-body)', color: '#4B4B4B',
                    }}>{r.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#4B4B4B', fontVariantNumeric: 'tabular-nums' }}>
                    {r.unitOfMeasure}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#242424', fontWeight: 600 }}>
                    €{r.costPerUnit.toFixed(2)}
                    <span style={{ font: '400 12px/16px var(--font-body)', color: '#676767', marginLeft: 4 }}>
                      / {r.unitOfMeasure}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusPill status={r.status} />
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4, opacity: hov || sel ? 1 : 0.4, transition: 'opacity 150ms' }}>
                      <button
                        onClick={() => router.push(`/skus/${r.id}/edit`)}
                        onMouseEnter={() => setHoverEdit(r.id)}
                        onMouseLeave={() => setHoverEdit(null)}
                        title="Edit SKU"
                        style={{ ...iconBtnBase, color: '#067A46', background: hoverEdit === r.id ? '#F6FDE9' : 'transparent' }}>
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        onMouseEnter={() => setHoverDelete(r.id)}
                        onMouseLeave={() => setHoverDelete(null)}
                        disabled={isPending}
                        title="Delete SKU"
                        style={{ ...iconBtnBase, color: '#DB1D1D', background: hoverDelete === r.id ? '#FFEAE9' : 'transparent' }}>
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#676767', font: '400 14px/20px var(--font-body)' }}>
                  {skus.length === 0 ? 'No SKUs yet. Create your first one.' : 'No SKUs match your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #EEEEEE', font: '400 13px/16px var(--font-body)', color: '#676767' }}>
        Showing {rows.length} of {skus.length} SKU{skus.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
