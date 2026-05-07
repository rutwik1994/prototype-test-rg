"use client";

export type SkuRow = {
  id: number;
  name: string;
  category: string;
  unitOfMeasure: string;
  costPerUnit: number;
  status: string;
};

export function SkuTable({ skus }: { skus: SkuRow[] }) {
  if (skus.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-10 text-center">
        No SKUs yet.
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
