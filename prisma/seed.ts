import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeonHttp(url, {});
  return new PrismaClient({ adapter } as any);
}

const skus = [
  { name: "Atlantic Salmon Fillet",      category: "Protein",   unitOfMeasure: "kg",   costPerUnit: 18.40, status: "Active" },
  { name: "Free-Range Chicken Breast",   category: "Protein",   unitOfMeasure: "kg",   costPerUnit: 9.95,  status: "Active" },
  { name: "Wagyu Beef Shoulder",         category: "Protein",   unitOfMeasure: "kg",   costPerUnit: 64.00, status: "Active" },
  { name: "Sushi-Grade Tuna",            category: "Protein",   unitOfMeasure: "kg",   costPerUnit: 36.80, status: "Inactive" },
  { name: "Heirloom Cherry Tomatoes",    category: "Vegetable", unitOfMeasure: "kg",   costPerUnit: 4.85,  status: "Active" },
  { name: "Organic Baby Spinach",        category: "Vegetable", unitOfMeasure: "kg",   costPerUnit: 6.20,  status: "Active" },
  { name: "Roma Plum Tomatoes",          category: "Vegetable", unitOfMeasure: "kg",   costPerUnit: 2.40,  status: "Active" },
  { name: "Fresh Basil",                 category: "Vegetable", unitOfMeasure: "unit", costPerUnit: 1.10,  status: "Active" },
  { name: "Aged Parmesan",               category: "Dairy",     unitOfMeasure: "kg",   costPerUnit: 22.40, status: "Active" },
  { name: "Coconut Milk, Full-Fat",      category: "Dairy",     unitOfMeasure: "L",    costPerUnit: 2.85,  status: "Active" },
  { name: "Greek Yoghurt, 10% Fat",      category: "Dairy",     unitOfMeasure: "kg",   costPerUnit: 5.60,  status: "Active" },
  { name: "Cultured Butter, Unsalted",   category: "Dairy",     unitOfMeasure: "kg",   costPerUnit: 14.20, status: "Active" },
  { name: "Sourdough Boule",             category: "Grain",     unitOfMeasure: "unit", costPerUnit: 3.20,  status: "Active" },
  { name: "Arborio Rice",                category: "Grain",     unitOfMeasure: "kg",   costPerUnit: 3.80,  status: "Active" },
  { name: "Dried Pappardelle",           category: "Grain",     unitOfMeasure: "kg",   costPerUnit: 2.95,  status: "Active" },
  { name: "Smoked Paprika",              category: "Sauce",     unitOfMeasure: "g",    costPerUnit: 0.18,  status: "Active" },
  { name: "Calabrian Chilli Paste",      category: "Sauce",     unitOfMeasure: "g",    costPerUnit: 0.04,  status: "Inactive" },
  { name: "Extra-Virgin Olive Oil",      category: "Sauce",     unitOfMeasure: "L",    costPerUnit: 12.60, status: "Active" },
  { name: "White Truffle Oil",           category: "Sauce",     unitOfMeasure: "ml",   costPerUnit: 0.38,  status: "Active" },
  { name: "Kombu Dashi Stock",           category: "Other",     unitOfMeasure: "L",    costPerUnit: 4.50,  status: "Active" },
];

async function main() {
  const prisma = createPrisma();
  console.log("Seeding 20 SKUs...");
  await prisma.sku.deleteMany();
  for (const sku of skus) {
    await prisma.sku.create({ data: sku });
  }
  console.log("Done.");
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
