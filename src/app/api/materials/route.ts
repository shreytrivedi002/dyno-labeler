import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Material } from "@/models/Material";
import { z } from "zod";

const MaterialSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  pricePerUnit: z.number().nonnegative(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const materials = await Material.find({ userId }).sort({ name: 1 }).lean();
  return NextResponse.json(materials.map(m => ({ ...m, _id: String(m._id) })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = MaterialSchema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await connectToDatabase();
  const created = await Material.create({ userId, ...data.data });
  return NextResponse.json({ ...created.toObject(), _id: String(created._id) }, { status: 201 });
}
