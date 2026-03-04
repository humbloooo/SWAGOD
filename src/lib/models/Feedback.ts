import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    name: string;
    email: string;
    message: string;
    date: string;
}

const FeedbackSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() }
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

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
