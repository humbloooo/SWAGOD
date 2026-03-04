import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
    date: string; // YYYY-MM-DD format
    count: number;
}

const VisitSchema: Schema = new Schema({
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

export default mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
