"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteSku } from "@/lib/actions";
import type { Sku } from "@/app/generated/prisma/client";

export function SkuTable({ skus }: { skus: Sku[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (!confirm("Delete this SKU?")) return;
    startTransition(() => deleteSku(id));
  };

  if (skus.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-10 text-center">
        No SKUs yet. Create one to get started.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Unit</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Cost (€)</th>
          <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
          <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {skus.map((sku, i) => (
          <tr
            key={sku.id}
            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === skus.length - 1 ? "border-b-0" : ""}`}
          >
            <td className="px-4 py-3 font-medium text-gray-900">{sku.name}</td>
            <td className="px-4 py-3 text-gray-600">{sku.category}</td>
            <td className="px-4 py-3 text-gray-600">{sku.unitOfMeasure}</td>
            <td className="px-4 py-3 text-gray-600">€{sku.costPerUnit.toFixed(2)}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                sku.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {sku.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right space-x-2">
              <Link
                href={`/skus/${sku.id}/edit`}
                className="inline-flex items-center px-3 py-1 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(sku.id)}
                disabled={isPending}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
