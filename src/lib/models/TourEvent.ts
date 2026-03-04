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
            (ret as any).id = (ret as any)._id.toString();
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.TourEvent || mongoose.model<ITourEvent>('TourEvent', TourEventSchema);
