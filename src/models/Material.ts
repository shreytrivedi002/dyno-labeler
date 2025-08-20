import mongoose, { Schema, Model, models } from "mongoose";

export interface IMaterial {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	name: string;
	unit: string;
	pricePerUnit: number;
	createdAt: Date;
	updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		name: { type: String, required: true },
		unit: { type: String, required: true },
		pricePerUnit: { type: Number, required: true, min: 0 },
	},
	{ timestamps: true }
);

MaterialSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Material: Model<IMaterial> = (models.Material as Model<IMaterial>) || mongoose.model<IMaterial>("Material", MaterialSchema);
