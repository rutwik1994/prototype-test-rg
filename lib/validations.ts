import { z } from "zod";

export const CATEGORIES = [
  "Protein",
  "Vegetable",
  "Grain",
  "Dairy",
  "Sauce",
  "Other",
] as const;

export const UNITS = ["kg", "g", "L", "ml", "unit", "piece"] as const;

export const STATUSES = ["Active", "Inactive"] as const;

export const skuSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(CATEGORIES, "Category is required"),
  unitOfMeasure: z.enum(UNITS, "Unit is required"),
  costPerUnit: z.number("Cost must be a number").positive("Cost must be positive"),
  status: z.enum(STATUSES, "Status is required"),
});

export type SkuFormData = z.infer<typeof skuSchema>;
