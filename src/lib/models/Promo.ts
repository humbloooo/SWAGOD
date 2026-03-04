import mongoose, { Schema } from 'mongoose';
import { IProduct } from './Product';

const PromoSchema: Schema = new Schema({
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

export default mongoose.models.Promo || mongoose.model<IProduct>('Promo', PromoSchema);
