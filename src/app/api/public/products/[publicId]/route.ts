import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { Material } from "@/models/Material";
import { calculateFinalPrice } from "@/lib/pricing";
import { User } from "@/models/User";

export async function GET(_req: Request, context: unknown) {
  await connectToDatabase();
  const { params } = context as { params: { publicId: string } };
  const product = await Product.findOne({ publicId: params.publicId }).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [materials, user] = await Promise.all([
    Material.find({ userId: product.userId }).lean(),
    User.findById(product.userId).select("theme name").lean(),
  ]);
  const materialMap = new Map(materials.map(m => [String(m._id), m]));

  const materialCost = product.materials.reduce((sum, item) => {
    const m = materialMap.get(String(item.materialId));
    if (!m) return sum;
    return sum + m.pricePerUnit * item.quantity;
  }, 0);

  const totals = calculateFinalPrice({
    materialCost,
    makingCharges: product.makingCharges,
    taxPercentage: product.taxPercentage,
  });

  return NextResponse.json({
    publicId: product.publicId,
    name: product.name,
    materials: product.materials,
    makingCharges: product.makingCharges,
    taxPercentage: product.taxPercentage,
    totals,
    qrCodeUrl: product.qrCodeUrl,
    theme: user?.theme || "emerald",
    shopName: user?.name || "",
  });
}
