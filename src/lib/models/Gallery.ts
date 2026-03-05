import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const returned = ret as any;
            returned.id = String(returned._id);
            delete returned._id;
            delete returned.__v;
            return returned;
        }
    }
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
