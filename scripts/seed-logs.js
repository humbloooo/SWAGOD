import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars manually for standalone script
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) {
            process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI;

const LogSchema = new mongoose.Schema({
    version: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['UPDATE', 'FIX', 'FEATURE', 'SECURITY'], default: 'UPDATE' },
    isAdminOnly: { type: Boolean, default: false }
});

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

const INITIAL_LOGS = [
    {
        version: "v1.1.0",
        title: "SYSTEM REFINEMENT",
        content: "UI POLISH, RED HEADLINE CONTRAST, COMPACT MOBILE NAVIGATION, SIDEBAR DIRECTION FIX. DATABASE-DRIVEN LOGGING SYSTEM DEPLOYED.",
        type: "UPDATE",
        isAdminOnly: false
    },
    {
        version: "v1.0.0",
        title: "THE SINGULARITY",
        content: "FULL STACK MIGRATION: REACT, MONGODB, CLOUDINARY. FIREBASE PERMANENTLY DECOMMISSIONED. ADVANCED STABILITY PROTOCOLS.",
        type: "FEATURE",
        isAdminOnly: false
    },
    {
        version: "v0.8.0",
        title: "ADMIN HARDENING",
        content: "SECURITY PROTOCOLS, OPS DASHBOARD SIMPLIFICATION, SEO OPTIMIZATION.",
        type: "SECURITY",
        isAdminOnly: true
    }
];

async function seedLogs() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'swagod' });
        console.log("Connected to MongoDB");

        await Log.deleteMany({});
        await Log.insertMany(INITIAL_LOGS);

        console.log("Logs seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedLogs();
