import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Material } from "@/models/Material";
import { Product } from "@/models/Product";
import { z } from "zod";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { calculateFinalPrice, calculateMaterialCost } from "@/lib/pricing";
import bwipjs from "bwip-js";

const ProductItemSchema = z.object({ materialId: z.string(), quantity: z.number().nonnegative() });
const ProductSchema = z.object({
  name: z.string().min(1),
  materials: z.array(ProductItemSchema),
  makingCharges: z.number().nonnegative(),
  taxPercentage: z.number().nonnegative(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const products = await Product.find({ userId }).lean();
  return NextResponse.json(products.map(p => ({ ...p, _id: String(p._id) })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await connectToDatabase();

  const materials = await Material.find({ userId }).lean();
  const materialsMap = new Map(materials.map(m => [String(m._id), m]));

  const materialCost = calculateMaterialCost(
    materialsMap,
    parsed.data.materials.map(i => ({ materialId: i.materialId, quantity: i.quantity }))
  );

  const { finalPrice } = calculateFinalPrice({
    materialCost,
    makingCharges: parsed.data.makingCharges,
    taxPercentage: parsed.data.taxPercentage,
  });

  const publicId = nanoid(10);
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  const headerBase = `${new URL(req.url).protocol}//${new URL(req.url).host}`;
  const baseUrl = envBase && envBase.length > 0 ? envBase : headerBase;
  const publicUrl = `${baseUrl}/product/${publicId}`;
  const qrCodeUrl = await QRCode.toDataURL(publicUrl);

  const png = await bwipjs.toBuffer({
    bcid: 'code128',
    text: publicId,
    scale: 3,
    height: 10,
    includetext: false,
    textxalign: 'center',
  });
  const barcodeUrl = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;

  const created = await Product.create({
    userId,
    publicId,
    name: parsed.data.name,
    materials: parsed.data.materials,
    makingCharges: parsed.data.makingCharges,
    taxPercentage: parsed.data.taxPercentage,
    qrCodeUrl,
    barcodeUrl,
  });

  return NextResponse.json(
    { ...created.toObject(), _id: String(created._id), finalPrice },
    { status: 201 }
  );
}
