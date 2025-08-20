import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const ProductItemSchema = z.object({ materialId: z.string(), quantity: z.number().nonnegative() });
const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  materials: z.array(ProductItemSchema).optional(),
  makingCharges: z.number().nonnegative().optional(),
  taxPercentage: z.number().nonnegative().optional(),
});

export async function PUT(req: Request, context: unknown) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { params } = context as { params: { id: string } };

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await connectToDatabase();
  const updated = await Product.findOneAndUpdate(
    { _id: params.id, userId },
    { $set: parsed.data },
    { new: true }
  );
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...updated.toObject(), _id: String(updated._id) });
}

export async function DELETE(_req: Request, context: unknown) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { params } = context as { params: { id: string } };

  await connectToDatabase();
  const res = await Product.deleteOne({ _id: params.id, userId });
  if (res.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
