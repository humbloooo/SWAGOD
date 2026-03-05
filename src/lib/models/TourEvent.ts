import mongoose, { Schema, Document } from 'mongoose';

export interface ITourEvent extends Document {
    date: string;
    city: string;
    venue: string;
    ticketLink?: string;
    soldOut?: boolean;
}

const TourEventSchema: Schema = new Schema({
    date: { type: String, required: true },
    city: { type: String, required: true },
    venue: { type: String, required: true },
    ticketLink: { type: String },
    soldOut: { type: Boolean, default: false }
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

export default mongoose.models.TourEvent || mongoose.model<ITourEvent>('TourEvent', TourEventSchema);
