import type { IMaterial } from "@/models/Material";

export type ProductMaterialInput = { materialId: string; quantity: number };

export function calculateMaterialCost(materialsMap: Map<string, IMaterial>, items: ProductMaterialInput[]): number {
  let cost = 0;
  for (const item of items) {
    const material = materialsMap.get(item.materialId);
    if (!material) continue;
    cost += item.quantity * material.pricePerUnit;
  }
  return cost;
}

export function calculateFinalPrice(params: {
  materialCost: number;
  makingCharges: number;
  taxPercentage: number;
}): { subtotal: number; taxAmount: number; finalPrice: number } {
  const subtotal = params.materialCost + params.makingCharges;
  const taxAmount = subtotal * (params.taxPercentage / 100);
  const finalPrice = subtotal + taxAmount;
  return { subtotal, taxAmount, finalPrice };
}
