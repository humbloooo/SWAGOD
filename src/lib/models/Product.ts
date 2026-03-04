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
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    sizes: [{ type: String }],
    images: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
    likes: [{ type: String }],
    active: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            (ret as any).id = (ret as any)._id.toString();
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
