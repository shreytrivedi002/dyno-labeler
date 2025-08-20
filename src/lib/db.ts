import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
	if (cachedPromise) {
		return cachedPromise;
	}

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error("MONGODB_URI is not defined in environment variables");
	}

	const dbName = process.env.MONGODB_DB || "priceLabelApp";
	cachedPromise = mongoose.connect(uri, { bufferCommands: false, dbName }) as unknown as Promise<typeof mongoose>;
	return cachedPromise;
}
