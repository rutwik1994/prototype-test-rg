"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, Field, SageInput, SageSelect } from "@/components/sage/primitives";
import { skuSchema, type SkuFormData, CATEGORIES, UNITS, STATUSES } from "@/lib/validations";
import { createSku, updateSku } from "@/lib/actions";
import type { Sku } from "@/app/generated/prisma/client";

interface SkuFormProps {
  sku?: Sku;
}

export function SkuForm({ sku }: SkuFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SkuFormData>({
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
    <div style={{
      background: '#fff', border: '1px solid #E4E4E4', borderRadius: 8,
      padding: 32, maxWidth: 520, boxShadow: '0 2px 4px rgba(36,36,36,.06)',
    }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <Field label="Name" error={errors.name?.message}>
          <SageInput
            placeholder="e.g. Chicken Breast 250g"
            error={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field label="Category" error={errors.category?.message}>
          <SageSelect
            value={watch("category") ?? ""}
            onChange={e => setValue("category", e.target.value as SkuFormData["category"])}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
            placeholder="Select category"
            error={!!errors.category}
          />
        </Field>

        <Field label="Unit of Measure" error={errors.unitOfMeasure?.message}>
          <SageSelect
            value={watch("unitOfMeasure") ?? ""}
            onChange={e => setValue("unitOfMeasure", e.target.value as SkuFormData["unitOfMeasure"])}
            options={UNITS.map(u => ({ value: u, label: u }))}
            placeholder="Select unit"
            error={!!errors.unitOfMeasure}
          />
        </Field>

        <Field label="Cost per Unit (€)" error={errors.costPerUnit?.message}>
          <SageInput
            type="number"
            step="0.01"
            placeholder="0.00"
            error={!!errors.costPerUnit}
            {...register("costPerUnit", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Status">
          <SageSelect
            value={watch("status") ?? "Active"}
            onChange={e => setValue("status", e.target.value as SkuFormData["status"])}
            options={STATUSES.map(s => ({ value: s, label: s }))}
          />
        </Field>

        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <Button type="submit" variant="fill" color="positive" disabled={isPending}>
            {isPending ? "Saving…" : sku ? "Save changes" : "Create SKU"}
          </Button>
          <Button type="button" variant="outline" color="neutral" onClick={() => router.push("/skus")}>
            Cancel
          </Button>
        </div>

      </form>
    </div>
  );
}
