import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    image?: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    emailVerified?: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    emailVerified: { type: Date }
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

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
