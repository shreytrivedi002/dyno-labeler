import mongoose, { Schema, Model, models } from "mongoose";

export interface IProductMaterialItem {
	materialId: mongoose.Types.ObjectId;
	quantity: number;
}

export interface IProduct {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	publicId: string;
	name: string;
	materials: IProductMaterialItem[];
	makingCharges: number;
	taxPercentage: number;
	qrCodeUrl?: string;
	barcodeUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ProductMaterialSchema = new Schema<IProductMaterialItem>({
	materialId: { type: Schema.Types.ObjectId, ref: "Material", required: true },
	quantity: { type: Number, required: true, min: 0 },
});

const ProductSchema = new Schema<IProduct>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		publicId: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true },
		materials: { type: [ProductMaterialSchema], default: [] },
		makingCharges: { type: Number, required: true, min: 0 },
		taxPercentage: { type: Number, required: true, min: 0 },
		qrCodeUrl: { type: String },
		barcodeUrl: { type: String },
	},
	{ timestamps: true }
);

export const Product: Model<IProduct> = (models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
