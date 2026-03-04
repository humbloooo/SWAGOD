import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    image?: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    emailVerified?: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    emailVerified: { type: Date }
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

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
