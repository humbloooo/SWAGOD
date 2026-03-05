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
    date?: string; // used for Galleries
}

const GallerySchema: Schema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, default: "gallery" },
    description: { type: String, required: true },
    sizes: [{ type: String }],
    images: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
    date: { type: String, default: () => new Date().toISOString() },
    likes: [{ type: String }],
    active: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            (ret as Record<string, unknown>).id = String((ret as Record<string, unknown>)._id);
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.Gallery || mongoose.model<IProduct>('Gallery', GallerySchema);
