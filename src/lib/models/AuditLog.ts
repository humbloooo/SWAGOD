import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    entity: string;
    entityId?: string;
    adminEmail?: string;
    userEmail?: string;
    timestamp: string;
    details?: string;
    ip?: string;
    device?: string;
}

const AuditLogSchema: Schema = new Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    adminEmail: { type: String },
    userEmail: { type: String },
    timestamp: { type: String, default: () => new Date().toISOString() },
    details: { type: String },
    ip: { type: String },
    device: { type: String }
}, {
    timestamps: true
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
