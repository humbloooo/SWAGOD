import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    version: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // Markdown supported
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['UPDATE', 'FIX', 'FEATURE', 'SECURITY'], default: 'UPDATE' },
    isAdminOnly: { type: Boolean, default: false }
});

export const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);
