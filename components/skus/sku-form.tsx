"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  skuSchema,
  type SkuFormData,
  CATEGORIES,
  UNITS,
  STATUSES,
} from "@/lib/validations";
import { createSku, updateSku } from "@/lib/actions";
import type { Sku } from "@/app/generated/prisma/client";

interface SkuFormProps {
  sku?: Sku;
}

export function SkuForm({ sku }: SkuFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkuFormData>({
    resolver: zodResolver(skuSchema),
    defaultValues: sku
      ? {
          name: sku.name,
          category: sku.category as SkuFormData["category"],
          unitOfMeasure: sku.unitOfMeasure as SkuFormData["unitOfMeasure"],
          costPerUnit: sku.costPerUnit,
          status: sku.status as SkuFormData["status"],
        }
      : { status: "Active" },
  });

  const onSubmit = (data: SkuFormData) => {
    startTransition(async () => {
      if (sku) {
        await updateSku(sku.id, data);
      } else {
        await createSku(data);
      }
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{sku ? "Edit SKU" : "New Culinary SKU"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Chicken Breast 250g"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              defaultValue={sku?.category}
              onValueChange={(v) =>
                setValue("category", v as SkuFormData["category"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Unit of Measure</Label>
            <Select
              defaultValue={sku?.unitOfMeasure}
              onValueChange={(v) =>
                setValue("unitOfMeasure", v as SkuFormData["unitOfMeasure"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unitOfMeasure && (
              <p className="text-sm text-red-500">
                {errors.unitOfMeasure.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="costPerUnit">Cost per Unit (€)</Label>
            <Input
              id="costPerUnit"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("costPerUnit", { valueAsNumber: true })}
            />
            {errors.costPerUnit && (
              <p className="text-sm text-red-500">
                {errors.costPerUnit.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              defaultValue={sku?.status ?? "Active"}
              onValueChange={(v) =>
                setValue("status", v as SkuFormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : sku ? "Save changes" : "Create SKU"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/skus")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
