import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Material } from "@/models/Material";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  pricePerUnit: z.number().nonnegative().optional(),
});

export async function PUT(req: Request, context: unknown) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { params } = context as { params: { id: string } };

  const body = await req.json();
  const data = UpdateSchema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await connectToDatabase();
  const updated = await Material.findOneAndUpdate(
    { _id: params.id, userId },
    { $set: data.data },
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
  const res = await Material.deleteOne({ _id: params.id, userId });
  if (res.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
