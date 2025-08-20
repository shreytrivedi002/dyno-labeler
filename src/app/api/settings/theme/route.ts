import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { z } from "zod";

const Schema = z.object({ theme: z.enum(["emerald", "royal", "amber", "rose"]) });

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const user = await User.findById(userId).select("theme").lean();
  return NextResponse.json({ theme: user?.theme || "emerald" });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await connectToDatabase();
  await User.findByIdAndUpdate(userId, { theme: parsed.data.theme });
  return NextResponse.json({ ok: true });
}
