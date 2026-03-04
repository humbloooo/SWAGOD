import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    entity: string;
    entityId: string;
    adminEmail: string;
    timestamp?: string;
    details?: string;
}

const AuditLogSchema: Schema = new Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    details: { type: String }
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

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
