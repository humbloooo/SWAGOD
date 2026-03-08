import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    orderId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    items: {
        productId: string;
        title: string;
        quantity: number;
        price: number;
    }[];
    paymentMethod?: string;
    timestamp: Date;
}

const TransactionSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    items: [{
        productId: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    paymentMethod: { type: String },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            const returned = ret as Record<string, unknown>;
            returned.id = String(returned._id);
            delete returned._id;
            delete returned.__v;
            return returned;
        }
    }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
