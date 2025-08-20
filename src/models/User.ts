import mongoose, { Schema, Model, models } from "mongoose";

export type ThemeKey = "emerald" | "royal" | "amber" | "rose";

export interface IUser {
	_id: mongoose.Types.ObjectId;
	name: string;
	contact: string;
	email: string;
	password: string;
	subdomain?: string;
	theme?: ThemeKey;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		contact: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		password: { type: String, required: true },
		subdomain: { type: String },
		theme: { type: String, enum: ["emerald", "royal", "amber", "rose"], default: "emerald" },
	},
	{ timestamps: true }
);

export const User: Model<IUser> = (models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
