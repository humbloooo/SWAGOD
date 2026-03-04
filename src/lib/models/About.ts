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
            (ret as any).id = (ret as any)._id;
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.About || mongoose.model<IAboutData>('About', AboutSchema);
