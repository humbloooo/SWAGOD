import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    price: number;
    image: string;
    category: string;
    description: string;
    sizes?: string[];
    images?: string[];
    createdAt?: string;
    likes?: string[];
    active?: boolean;
    subCategory?: string;
    stockCount?: number;
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String, required: true },
    sizes: [{ type: String }],
    images: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
    likes: [{ type: String }],
    active: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10 }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            const returned = ret as Record<string, unknown>;
            returned.id = (returned._id as mongoose.Types.ObjectId).toString();
            Reflect.deleteProperty(returned, '_id');
            Reflect.deleteProperty(returned, '__v');
        }
    }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
