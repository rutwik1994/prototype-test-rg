"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <p className="text-muted-foreground text-sm py-8 text-center">
        No SKUs yet. Create one to get started.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Cost (€)</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skus.map((sku) => (
          <TableRow key={sku.id}>
            <TableCell className="font-medium">{sku.name}</TableCell>
            <TableCell>{sku.category}</TableCell>
            <TableCell>{sku.unitOfMeasure}</TableCell>
            <TableCell>€{sku.costPerUnit.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={sku.status === "Active" ? "default" : "secondary"}>
                {sku.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
