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
    isPromo?: boolean;
    videoUrl?: string; // Link to Cloudinary video
    cloudinaryPublicId?: string;
    mediaType?: 'image' | 'video' | 'both';
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
    stockCount: { type: Number, default: 10 },
    isPromo: { type: Boolean, default: false },
    videoUrl: { type: String },
    cloudinaryPublicId: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'both'], default: 'image' }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const returned = ret as any;
            returned.id = String(returned._id);
            delete returned._id;
            delete returned.__v;
            return returned;
        }
    }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
