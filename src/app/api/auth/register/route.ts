import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

const RegisterSchema = z.object({
	name: z.string().min(1),
	contact: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	subdomain: z.string().optional(),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const data = RegisterSchema.parse(body);

		await connectToDatabase();
		const existing = await User.findOne({ email: data.email });
		if (existing) {
			return NextResponse.json({ error: "Email already registered" }, { status: 409 });
		}

		const hashed = await hash(data.password, 10);
		const user = await User.create({
			name: data.name,
			contact: data.contact,
			email: data.email,
			password: hashed,
			subdomain: data.subdomain,
		});

		return NextResponse.json({ id: String(user._id), email: user.email, name: user.name });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Invalid request";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
