"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right space-x-2">
              <Link
                href={`/skus/${sku.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Edit
              </Link>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => handleDelete(sku.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
