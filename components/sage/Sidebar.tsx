"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "./icons";

type NavItem = { id: string; icon: IconName; label: string; path: string };
type NavGroup = { id: string; label: string; defaultOpen?: boolean; items: NavItem[] };

const GROUPS: NavGroup[] = [
  { id: 'fulfilment', label: 'Fulfilment', items: [
    { id: 'orders', icon: 'box',   label: 'Orders',        path: '/orders' },
    { id: 'fleet',  icon: 'truck', label: 'Fleet & routing', path: '/fleet' },
  ]},
  { id: 'production', label: 'Production Planning', defaultOpen: true, items: [
    { id: 'overview',     icon: 'home',   label: 'Overview',                  path: '/overview' },
    { id: 'recipes',      icon: 'recipe', label: 'Recipe Production Planning', path: '/recipes' },
    { id: 'kitting',      icon: 'box',    label: 'Kitting Planning',           path: '/skus' },
    { id: 'assembly',     icon: 'cloche', label: 'Assembly Planning',          path: '/assembly' },
    { id: 'setup',        icon: 'scale',  label: 'Production Setup Config',    path: '/setup' },
    { id: 'daily',        icon: 'book',   label: 'Daily Planning',             path: '/daily' },
    { id: 'substitution', icon: 'apple',  label: 'Kitting Substitution',       path: '/substitution' },
    { id: 'rack',         icon: 'inv',    label: 'Rack Plan Upload',           path: '/rack' },
    { id: 'exports',      icon: 'truck',  label: 'Exports',                    path: '/exports' },
  ]},
  { id: 'shipping', label: 'Shipping', items: [
    { id: 'manifests', icon: 'truck', label: 'Manifests', path: '/manifests' },
    { id: 'returns',   icon: 'box',   label: 'Returns',   path: '/returns' },
  ]},
  { id: 'integrated', label: 'Integrated Planning', items: [
    { id: 'forecast',  icon: 'scale', label: 'Forecast', path: '/forecast' },
    { id: 'capacity',  icon: 'inv',   label: 'Capacity', path: '/capacity' },
  ]},
];

const C = {
  head:    '#035624',
  body:    '#0E6B2C',
  band:    '#067A46',
  panel:   '#0A5E27',
  activeBg:'#04401A',
  accent:  '#96DC14',
  fg:      '#FFFFFF',
  muted:   'rgba(255,255,255,.72)',
  hover:   'rgba(255,255,255,.06)',
  divider: 'rgba(255,255,255,.12)',
};

function getActiveId(pathname: string): string {
  for (const g of GROUPS) {
    for (const item of g.items) {
      if (pathname === item.path || pathname.startsWith(item.path + '/')) return item.id;
    }
  }
  return '';
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeId = getActiveId(pathname);

  const [openGroups, setOpenGroups] = useState(
    () => new Set(GROUPS.filter(g => g.defaultOpen).map(g => g.id))
  );
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <aside style={{
      width: 256, background: C.body, color: C.fg,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Brand band */}
      <div style={{
        background: C.head, padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.divider}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 6, background: C.accent,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: C.head, font: '700 14px/1 var(--font-body)',
          }}>S</span>
          <span style={{ font: '700 14px/18px var(--font-body)', letterSpacing: '.02em' }}>
            SAGE
            <br />
            <span style={{ font: '400 11px/14px var(--font-body)', color: C.muted, letterSpacing: 0 }}>Enterprise</span>
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {GROUPS.map(g => {
          const open = openGroups.has(g.id);
          return (
            <div key={g.id}>
              <button onClick={() => toggle(g.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 16px', border: 0,
                background: open ? C.band : C.body,
                borderTop: `1px solid ${C.divider}`,
                color: C.fg, cursor: 'pointer',
                font: '600 14px/20px var(--font-body)', textAlign: 'left',
                transition: 'background 150ms var(--ease-out)',
              }}>
                <span>{g.label}</span>
                <span style={{ display: 'inline-flex', transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 200ms' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>

              {open && (
                <div style={{ background: C.panel, padding: '4px 0' }}>
                  {g.items.map(item => {
                    const isActive = activeId === item.id;
                    const isHover = hoverItem === item.id;
                    return (
                      <button key={item.id}
                        onClick={() => router.push(item.path)}
                        onMouseEnter={() => setHoverItem(item.id)}
                        onMouseLeave={() => setHoverItem(null)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 16px 10px 32px', border: 0, cursor: 'pointer',
                          background: isActive ? C.activeBg : (isHover ? C.hover : 'transparent'),
                          color: isActive ? C.accent : C.fg,
                          font: `${isActive ? 600 : 500} 14px/20px var(--font-body)`,
                          textAlign: 'left', transition: 'all 150ms var(--ease-out)',
                          position: 'relative',
                        }}>
                        {isActive && (
                          <span style={{
                            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                            width: 4, height: 4, borderRadius: '50%', background: C.accent,
                          }} />
                        )}
                        <Icon name={item.icon} size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        background: C.head, padding: '12px 16px', borderTop: `1px solid ${C.divider}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,.16)', color: C.fg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 13c1-2 3-3 5-3s4 1 5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '600 13px/16px var(--font-body)' }}>Kit Rodrigo</div>
          <div style={{ font: '400 11px/14px var(--font-body)', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            kit.rodrigo@helloconnec…
          </div>
        </div>
      </div>
    </aside>
  );
}
