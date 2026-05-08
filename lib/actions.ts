"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { skuSchema, type SkuFormData } from "@/lib/validations";

export async function getSkus() {
  return prisma.sku.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getSku(id: number) {
  return prisma.sku.findUnique({ where: { id } });
}

export async function createSku(data: SkuFormData) {
  const validated = skuSchema.parse(data);
  await prisma.sku.create({
    data: {
      ...validated,
      costPerUnit: parseFloat(validated.costPerUnit as unknown as string),
    },
  });
  revalidatePath("/skus");
  redirect("/skus");
}

export async function updateSku(id: number, data: SkuFormData) {
  const validated = skuSchema.parse(data);
  await prisma.sku.update({
    where: { id },
    data: {
      ...validated,
      costPerUnit: parseFloat(validated.costPerUnit as unknown as string),
    },
  });
  revalidatePath("/skus");
  redirect("/skus");
}

export async function deleteSku(id: number) {
  await prisma.sku.delete({ where: { id } });
  revalidatePath("/skus");
}

export async function deleteSkus(ids: number[]) {
  for (const id of ids) {
    await prisma.sku.delete({ where: { id } });
  }
  revalidatePath("/skus");
}
