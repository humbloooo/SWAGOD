import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutData extends Document {
    heading: string;
    paragraphs: string[];
    footer: string;
}

const AboutSchema: Schema = new Schema({
    _id: { type: String, default: 'main' }, // Single document collection
    heading: { type: String, required: true },
    paragraphs: [{ type: String }],
    footer: { type: String, required: true }
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

export default mongoose.models.About || mongoose.model<IAboutData>('About', AboutSchema);
