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

if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is missing in .env.local");
    process.exit(1);
}

// Minimal User Schema for script
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    password: { type: String } // Added password field
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function setAdmin(email, role = 'ADMIN', password) {
    if (!email) {
        console.error("❌ Please provide an email address.");
        console.log("Usage: node scripts/set-admin.js <email> [role] [password]");
        process.exit(1);
    }

    console.log(`🚀 Connecting to MongoDB...`);

    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'swagod' });
        console.log(`✅ Connected to MongoDB`);

        const updateData = { role: role };
        if (password) {
            updateData.password = password;
        }

        console.log(`🚀 Promoting/Updating ${email} to ${role}... ${password ? '(Password provided)' : ''}`);

        const result = await User.findOneAndUpdate(
            { email: email },
            { $set: updateData },
            { new: true, upsert: true }
        );

        console.log(`✅ SUCCESS: ${email} is now an ${role}!`);
        console.log(`   (Database ID: ${result._id})`);
        if (password) console.log(`   (Password has been updated)`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ ERROR:", error);
        process.exit(1);
    }
}

const email = process.argv[2];
const role = process.argv[3] || 'ADMIN';
const password = process.argv[4];
setAdmin(email, role.toUpperCase(), password);
